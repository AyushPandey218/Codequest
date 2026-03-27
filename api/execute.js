
import https from 'https';

const WANDBOX_COMPILERS = {
  'cpp': 'gcc-13.2.0',
  'java': 'openjdk-jdk-21+35',
  'c': 'gcc-13.2.0-c',
  'csharp': 'mono-6.12.0.199',
  'go': 'go-1.23.2',
  'rust': 'rust-1.82.0',
  'ruby': 'ruby-3.4.1',
  'php': 'php-8.3.12',
  'typescript': 'typescript-5.6.2',
  'kotlin': 'kotlin-1.9.10',
  'swift': 'swift-6.0.1',
  'python': 'cpython-3.12.0',
};

const postRequest = (url, body, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.stringify(body);
      const urlObj = new URL(url);
      const reqOptions = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'Mozilla/5.0',
          ...(options.headers || {})
        },
        timeout: options.timeout || 9500
      };

      const req = https.request(reqOptions, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: parsed, engine: urlObj.hostname });
          } catch (e) {
            reject(new Error(`Invalid JSON from ${urlObj.hostname}: ${responseBody.substring(0, 100)}`));
          }
        });
      });

      req.on('error', (err) => reject(new Error(`NetworkError: ${err.message}`)));
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }
    }
    
    const { language, version, files, stdin } = body || {};
    if (!language || !files) return res.status(400).json({ error: 'Missing fields' });

    const code = files[0].content;
    const compiler = WANDBOX_COMPILERS[language];

    const engines = [];
    
    // Engine A: Piston
    engines.push(postRequest('https://emkc.org/api/v2/piston/execute', { language, version, files, stdin }, { timeout: 9000 }));

    // Engine B: Wandbox
    if (compiler) {
      engines.push(postRequest('https://wandbox.org/api/compile.json', { 
        compiler, code, stdin, save: false 
      }, { 
        timeout: 9000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(r => {
        // Transform Wandbox format to Piston-like format
        return {
          ok: r.ok && r.data.status === "0",
          status: r.status,
          engine: 'wandbox',
          data: {
            run: {
              stdout: r.data.program_output || '',
              stderr: r.data.program_error || r.data.program_message || r.data.compiler_error || '',
              code: r.data.status === "0" ? 0 : 1
            }
          }
        };
      }));
    }

    try {
      // PROMISE.ANY is good, but we want to catch if ALL fail and show why
      const results = await Promise.allSettled(engines);
      
      const successful = results.find(r => r.status === 'fulfilled' && r.value.ok);
      if (successful) {
        return res.status(200).json(successful.value.data);
      }

      // If no success, aggregate errors safely
      const errors = results.map(r => r.status === 'fulfilled' ? (r.value?.data?.run?.stderr || r.value?.data?.message || 'No error message') : r.reason.message);
      return res.status(200).json({ // Return 200 even on compilation error so frontend can show it
        run: {
          stdout: '',
          stderr: `Engines failed. Details:\n1. Piston: ${errors[0] || 'N/A'}\n2. Wandbox: ${errors[1] || 'N/A'}`,
          code: 1
        }
      });

    } catch (err) {
      return res.status(502).json({ error: 'Internal execution orchestration failure', message: err.message });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
