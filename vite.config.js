import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

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

const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use('/api/execute', async (req, res, next) => {
      if (req.method !== 'POST') return next();

      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        const sendJson = (code, data) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          const parsed = JSON.parse(body);
          let { language, code, stdin, files } = parsed;
          if (!code && files && files.length > 0) code = files[0].content;
          if (!language || !code) return sendJson(400, { error: 'Missing language or code' });

          const langConfig = ONECOMPILER_LANGUAGES[language];
          if (!langConfig) return sendJson(400, { error: `Language ${language} not supported` });

          const apiKey = process.env.ONECOMPILER_API_KEY || '';
          const payload = JSON.stringify({
            properties: {
              language: langConfig.language,
              stdin: stdin || '',
              files: [{ name: `main.${langConfig.extension}`, content: code }]
            }
          });

          // Use Node's built-in https directly — never imported in browser context
          const { default: https } = await import('node:https');
          const result = await new Promise((resolve, reject) => {
            const options = {
              hostname: 'onecompiler.com',
              port: 443,
              path: '/api/code/exec',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'Authorization': apiKey,
                'User-Agent': 'Mozilla/5.0'
              },
              timeout: 9500
            };
            const httpsReq = https.request(options, httpsRes => {
              let data = '';
              httpsRes.on('data', c => data += c);
              httpsRes.on('end', () => {
                try { resolve({ status: httpsRes.statusCode, data: JSON.parse(data) }); }
                catch (e) { reject(new Error(`Invalid JSON: ${data.substring(0, 100)}`)); }
              });
            });
            httpsReq.on('error', err => reject(err));
            httpsReq.on('timeout', () => { httpsReq.destroy(); reject(new Error('Timeout')); });
            httpsReq.write(payload);
            httpsReq.end();
          });

          if (result.status < 200 || result.status >= 300) {
            return sendJson(502, { error: 'OneCompiler Error', message: result.data?.message });
          }

          const d = result.data;
          const isError = !!(d.stderr || d.exception);
          const output = [d.stdout, d.stderr, d.exception].filter(Boolean).join('\n').trim();
          return sendJson(200, {
            stdout: isError ? null : (output || null),
            stderr: isError ? (output || null) : null,
            error: isError ? (output || null) : null
          });

        } catch (err) {
          console.error('[API Mock] Error:', err.message);
          sendJson(500, { error: 'Local execution error', message: err.message });
        }
      });
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMock()],
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {},
  },
})
