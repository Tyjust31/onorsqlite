import Database from 'better-sqlite3';

const db = new Database('users.db');

// Init table si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT UNIQUE,
    password TEXT
  );
`);

export default db;
