
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
          'User-Agent': 'CodeQuest-Server/1.0',
          ...(options.headers || {})
        },
        timeout: options.timeout || 10000
      };

      const req = https.request(reqOptions, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ ok: false, status: res.statusCode, data: { error: 'Invalid JSON', raw: responseBody.slice(0, 100) } });
          }
        });
      });

      req.on('error', (err) => reject(new Error(`NetworkError: ${err.message}`)));
      req.on('timeout', () => { req.destroy(); reject(new Error('GatewayTimeout')); });
      req.write(data);
      req.end();
    } catch (err) {
      reject(new Error(`SetupError: ${err.message}`));
    }
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Parse body safely
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'Invalid JSON body' }); }
    }
    
    const { language, version, files, stdin } = body || {};
    if (!language || !files || !files[0]) return res.status(400).json({ error: 'Missing required fields (language/files)' });

    const code = files[0].content;

    // 2. Try Piston
    try {
      const piston = await postRequest('https://emkc.org/api/v2/piston/execute', { language, version, files, stdin }, { timeout: 7000 });
      if (piston.ok && (!piston.data.message || !piston.data.message.includes('Unauthorized'))) {
        return res.status(200).json(piston.data);
      }
    } catch (e) {
      console.warn('Piston fail:', e.message);
    }

    // 3. Fallback to Wandbox
    const compiler = WANDBOX_COMPILERS[language];
    if (compiler) {
      try {
        const wandbox = await postRequest('https://online.wandbox.org/api/compile.json', { compiler, code, stdin, save: false }, { 
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (wandbox.ok) {
          return res.status(200).json({
            run: { stdout: wandbox.data.program_output || '', stderr: wandbox.data.program_error || wandbox.data.program_message || '', code: wandbox.data.status === "0" ? 0 : 1 }
          });
        }
      } catch (e) {
        console.warn('Wandbox fail:', e.message);
      }
    }

    return res.status(502).json({ error: 'Execution engines failing or timeout. Please retry.', engines_attempted: ['piston', 'wandbox'] });

  } catch (error) {
    console.error('CRASH:', error);
    return res.status(500).json({ error: 'Handler Crash', message: error.message, stack: error.stack });
  }
}
