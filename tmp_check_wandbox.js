import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(JSON.parse(data)); });
    }).on('error', (err) => { reject(err); });
  });
}

async function main() {
  try {
    const data = await get('https://wandbox.org/api/list.json');
    const csharp = data.filter(c => c.language.toLowerCase().includes('c#'));
    const java = data.filter(c => c.language.toLowerCase().includes('java'));
    const cpp = data.filter(c => c.language.toLowerCase().includes('c++'));
    
    console.log('--- C# Compilers ---');
    csharp.forEach(c => console.log(c.name));
    console.log('\n--- Java Compilers ---');
    java.forEach(c => console.log(c.name));
    console.log('\n--- C++ Compilers ---');
    cpp.forEach(c => console.log(c.name));
  } catch (err) {
    console.error(err);
  }
}

main();
