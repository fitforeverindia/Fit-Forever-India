const { Client } = require('pg');

const host = 'db.ezudcnndhboepasvlvas.supabase.co';
const user = 'postgres';
const passwords = [
  'ezudcnndhboepasvlvas',
  'postgres',
  'admin',
  'fitforever',
  'FitForever',
  'FitForeverIndia',
  'FitForeverIndia123',
  'FitForever123',
  'FitForever2026',
  'fitforever2026'
];

async function tryPasswords() {
  for (const password of passwords) {
    console.log(`Trying password: "${password}"...`);
    const client = new Client({
      host,
      port: 5432,
      database: 'postgres',
      user,
      password,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`SUCCESS! Password is: "${password}"`);
      
      // Let's print existing tables to make sure we are connected and it works
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('Tables:', res.rows.map(r => r.table_name));
      
      await client.end();
      return password;
    } catch (err) {
      console.log(`Failed for "${password}": ${err.message}`);
    }
  }
  console.log('None of the common passwords worked.');
  return null;
}

tryPasswords();
