const http = require('http');

function testLogin(identifier, label) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ identifier, password: 'password123' });
    const start = Date.now();
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const elapsed = Date.now() - start;
        console.log(`[${label}] Status: ${res.statusCode} | Latency: ${elapsed}ms | Message: ${body.substring(0, 80)}`);
        resolve();
      });
    });
    req.on('error', err => {
      console.error(err);
      resolve();
    });
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Testing SAYONARA Login Authentication Speed & Options:');
  await testLogin('S220697', 'COLLEGE ID LOGIN');
  await testLogin('deepa.personal@gmail.com', 'PERSONAL EMAIL LOGIN');
  await testLogin('7842439105', '10-DIGIT MOBILE NUMBER LOGIN');
}

run();
