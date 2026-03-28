import https from 'https';

const ONECOMPILER_LANGUAGES = {
  'Java': { language: 'java', extension: 'java' },
  'C++': { language: 'cpp', extension: 'cpp' },
  'C': { language: 'c', extension: 'c' },
  'Go': { language: 'go', extension: 'go' },
  'Rust': { language: 'rust', extension: 'rs' },
  'Ruby': { language: 'ruby', extension: 'rb' },
  'PHP': { language: 'php', extension: 'php' },
  'Kotlin': { language: 'kotlin', extension: 'kt' },
  'Swift': { language: 'swift', extension: 'swift' },
  'TypeScript': { language: 'nodejs', extension: 'js' },
  'Scala': { language: 'scala', extension: 'scala' },
  'C#': { language: 'csharp', extension: 'cs' },
  'Python3': { language: 'python', extension: 'py' },
  'Python': { language: 'python', extension: 'py' }
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
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: parsed });
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
    
    // Accept standard payload from frontend
    let { language, files, stdin, code } = body || {};
    
    // Normalize format
    if (!code && files && files.length > 0) code = files[0].content;
    
    if (!language || !code) return res.status(400).json({ error: 'Missing language or code' });

    const langConfig = ONECOMPILER_LANGUAGES[language];
    if (!langConfig) {
      return res.status(400).json({ error: `Language ${language} not supported for server execution.` });
    }

    const oneCompilerPayload = {
      properties: {
        language: langConfig.language,
        stdin: stdin || '',
        files: [
          {
            name: `main.${langConfig.extension}`,
            content: code
          }
        ]
      }
    };

    const oneCompilerApiKey = process.env.ONECOMPILER_API_KEY || 'oc_44hn6k38h_44hn6k396_a5040ed33966a6a56c3bab58aa1d35f357db94c93865d0f7';

    // Execute via OneCompiler
    const response = await postRequest('https://onecompiler.com/api/code/exec', oneCompilerPayload, { 
      timeout: 9500,
      headers: {
        'Authorization': oneCompilerApiKey
      }
    });
    
    if (!response.ok) {
      return res.status(502).json({
        error: 'Execution Engine Error',
        message: response.data?.message || 'Unknown OneCompiler Error'
      });
    }

    // OneCompiler returns { stdout, stderr, exception, compilationTime, executionTime }
    // We convert it to our standard frontend expected format
    const data = response.data;
    const isError = !!data.stderr || !!data.exception;
    const output = [data.stdout, data.stderr, data.exception].filter(Boolean).join('\n').trim();

    return res.status(200).json({
      stdout: isError ? null : output || null,
      stderr: isError ? output || null : null,
      error: isError ? output || null : null
    });

  } catch (err) {
    console.error('OneCompiler Orchestration Error:', err);
    return res.status(500).json({ error: 'Internal execution orchestration failure', message: err.message });
  }
}
