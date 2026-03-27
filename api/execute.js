
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language, version, files, stdin } = req.body;

  if (!language || !files) {
    return res.status(400).json({ error: 'Missing required fields: language and files' });
  }

  try {
    // Perform the request to Piston API from the server-side
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CodeQuest-Server/1.0'
      },
      body: JSON.stringify({
        language,
        version,
        files,
        stdin
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Execution Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
