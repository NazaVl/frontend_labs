const bcrypt = require('bcrypt');
const pool = require("./db");

const ADMIN_EMAIL = 'admin@mail.com';
const ADMIN_PASSWORD = 'AdminPassword';

async function setupDatabase() {
  try {
    await pool.connect();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        role VARCHAR(20) DEFAULT 'user'
      );
    `);
    console.log('Created table: users');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        topic VARCHAR(50),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created table: messages');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC,
        category TEXT
      );
    `);
    console.log('Created table: products');

    await pool.query(`
      INSERT INTO products (id, name, description, price, category) VALUES
      (1, 'Yamaha F310', 'Акустична гітара', 4500, 'strings'),
      (2, 'Fender Stratocaster', 'Електрогітара', 22000, 'strings'),
      (3, 'Ibanez GSR200', 'Бас-гітара', 9500, 'strings'),
      (4, 'Admira Alba', 'Класична гітара', 5200, 'strings'),
      (5, 'Taylor GS Mini', 'Акустична гітара', 18500, 'strings'),
      (6, 'Mapex Tornado', '5 барабанів + тарілки', 15000, 'drums'),
      (7, 'Roland TD-1DMK', 'Електронна установка', 28000, 'drums'),
      (8, 'Pearl Roadshow', '5 барабанів + аксесуари', 18500, 'drums'),
      (9, 'Alesis Nitro Mesh', 'Електронна, 8 елементів', 24000, 'drums'),
      (10, 'Ludwig Accent', 'Акустична, 5 барабанів', 16500, 'drums'),
      (11, 'Yamaha PSR-E373', 'Синтезатор', 9500, 'keys'),
      (12, 'Casio CT-X700', 'Синтезатор', 8800, 'keys'),
      (13, 'Korg B2', 'Цифрове піаніно', 17500, 'keys'),
      (14, 'Roland FP-10', 'Цифрове піаніно', 21500, 'keys'),
      (15, 'Medeli SP4200', 'Сценічне піаніно', 19800, 'keys'),
      (16, 'Yamaha YFL-222', 'Флейта', 13500, 'winds'),
      (17, 'Jupiter JAS710G', 'Саксофон альт', 29500, 'winds'),
      (18, 'Bach TR300H2', 'Труба', 16500, 'winds'),
      (19, 'Buffet Crampon Prodige', 'Кларнет', 18000, 'winds'),
      (20, 'Roy Benson HR-302', 'Валторна', 27500, 'winds')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Inserted initial products');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email) DO NOTHING;
      `,
      ['Admin', ADMIN_EMAIL, hashedPassword]
    );
    console.log(`Created admin user: ${ADMIN_EMAIL}`);

  } catch (err) {
    console.error('Init error:', err);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

setupDatabase();