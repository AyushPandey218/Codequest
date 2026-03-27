import https from 'https';

const JDOODLE_LANGUAGES = {
  'Java': { language: 'java', versionIndex: '4' },
  'C++': { language: 'cpp17', versionIndex: '0' },
  'C': { language: 'c', versionIndex: '5' },
  'Go': { language: 'go', versionIndex: '4' },
  'Rust': { language: 'rust', versionIndex: '4' },
  'Ruby': { language: 'ruby', versionIndex: '4' },
  'PHP': { language: 'php', versionIndex: '4' },
  'Kotlin': { language: 'kotlin', versionIndex: '3' },
  'Swift': { language: 'swift', versionIndex: '4' },
  'TypeScript': { language: 'nodejs', versionIndex: '4' },
  'Scala': { language: 'scala', versionIndex: '4' },
  'C#': { language: 'csharp', versionIndex: '4' }
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

    const langConfig = JDOODLE_LANGUAGES[language];
    if (!langConfig) {
      return res.status(400).json({ error: `Language ${language} not supported for server execution.` });
    }

    const clientId = process.env.JDOODLE_CLIENT_ID || process.env.VITE_JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET || process.env.VITE_JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        error: 'Server Misconfiguration', 
        message: 'JDoodle API keys are missing on the Vercel server instance.' 
      });
    }

    const jdoodlePayload = {
      clientId,
      clientSecret,
      script: code,
      language: langConfig.language,
      versionIndex: langConfig.versionIndex,
      stdin: stdin || ''
    };

    // Execute via JDoodle
    const response = await postRequest('https://api.jdoodle.com/v1/execute', jdoodlePayload, { timeout: 9000 });
    
    if (!response.ok) {
      return res.status(502).json({
        error: 'Execution Engine Error',
        message: response.data.error || 'Unknown JDoodle Error'
      });
    }

    // JDoodle returns { output, statusCode, memory, cpuTime }
    // We seamlessly convert it to our standard frontend expected format:
    // { stdout: '...', stderr: '...', code: 0 or 1 }
    
    const output = (response.data.output || '').trim();
    // JDoodle compilation errors usually just appear in output. statusCode can be non-200.
    const isError = response.data.statusCode !== 200;

    return res.status(200).json({
      stdout: isError ? null : output,
      stderr: isError ? output : null,
      error: isError ? output : null
    });

  } catch (err) {
    console.error('JDoodle Orchestration Error:', err);
    return res.status(500).json({ error: 'Internal execution orchestration failure', message: err.message });
  }
}
