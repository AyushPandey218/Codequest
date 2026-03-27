
// Comprehensive mapping for Piston -> Wandbox compilers
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language, version, files, stdin } = req.body;

  if (!language || !files) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const code = files[0].content;

  try {
    // 1. Try Piston First
    const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, version, files, stdin }),
    });

    if (pistonRes.ok) {
      const data = await pistonRes.json();
      // If piston returned a 401 or was flagged, try fallback
      if (data.message && data.message.includes('Unauthorized')) {
        console.log('Piston returned 401, falling back...');
      } else {
        return res.status(200).json(data);
      }
    }

    // 2. Fallback to Wandbox (Server-side call avoids 405)
    const wandboxCompiler = WANDBOX_COMPILERS[language];
    if (wandboxCompiler) {
      const wandboxRes = await fetch('https://online.wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
          compiler: wandboxCompiler,
          code,
          stdin,
          save: false,
        }),
      });

      if (wandboxRes.ok) {
        const data = await wandboxRes.json();
        // Transform Wandbox response to match the frontend expects from Piston
        return res.status(200).json({
          run: {
            stdout: data.program_output || '',
            stderr: data.program_error || data.program_message || '',
            code: data.status === "0" ? 0 : 1
          }
        });
      }
    }

    return res.status(500).json({ error: 'All execution engines failed.' });

  } catch (error) {
    console.error('Serverside Execution Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
