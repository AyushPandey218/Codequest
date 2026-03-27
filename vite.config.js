import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use('/api/execute', async (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          try { req.body = JSON.parse(body); } catch(e) { req.body = body; }
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };
          try {
            const { default: handler } = await import('./api/execute.js?t=' + Date.now());
            await handler(req, res);
          } catch (err) {
            res.status(500).json({ error: 'Local Mock Error', message: err.message });
          }
        });
      } else {
        next();
      }
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
    proxy: {
    },
  },
})


