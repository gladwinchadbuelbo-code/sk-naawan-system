const { Client } = require('pg');
const passwords = ['', 'postgres', 'password', 'admin123', 'root', 'BUELBO OCALRIT', 'Buelbo', 'Ocalrit', 'buelbo', 'ocalrit', 'BUELBO', 'OCALRIT'];

async function test() {
  const users = ['postgres', 'admin', 'root'];
  for (const user of users) {
    for (const pw of passwords) {
      const client = new Client({
        user: user,
        host: 'localhost',
        database: 'sk_naawan_ims',
        password: pw,
        port: 5432,
      });
      try {
        await client.connect();
        console.log(`SUCCESS_USER_PASSWORD: ${user}:${pw}`);
        await client.end();
        return;
      } catch (e) {
        // console.log(`FAIL: ${user}:${pw} - ${e.message}`);
      }
    }
  }
  console.log('ALL FAILED');
}
test();
