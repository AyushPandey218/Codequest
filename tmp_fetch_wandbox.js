import https from 'https';

const options = {
  hostname: 'wandbox.org',
  path: '/api/compiler/list.json',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = [];
  res.on('data', (chunk) => data.push(chunk));
  res.on('end', () => {
    try {
      const buffer = Buffer.concat(data);
      const str = buffer.toString();
      if (!str) {
        console.error('Empty response');
        return;
      }
      const list = JSON.parse(str);
      const tsCompilers = list.filter(c => c.language === 'TypeScript');
      console.log('--- TypeScript Compilers ---');
      tsCompilers.forEach(c => {
        console.log(`${c.name} (${c.version}) - ${c.display_name || c.title}`);
      });
      console.log('---------------------------');
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('Response status:', res.statusCode);
      console.log('Response preview:', buffer.toString().substring(0, 100));
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
