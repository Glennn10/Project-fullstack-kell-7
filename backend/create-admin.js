const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

const seedUsers = [
  {
    name: 'Administrator',
    email: 'admin@minjemdong.com',
    password: 'adminpassword123',
    role: 'admin',
  },
  {
    name: 'User Demo',
    email: 'user@minjemdong.com',
    password: 'userpassword123',
    role: 'user',
    phone: '081234567890',
    address: 'Jakarta',
  },
];

async function upsertUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);

  if (existingUser.rows.length > 0) {
    const updateResult = await pool.query(
      'UPDATE users SET name = $1, password = $2, role = $3 WHERE email = $4 RETURNING id, name, email, role',
      [user.name, hashedPassword, user.role, user.email],
    );

    return updateResult.rows[0];
  }

  const insertResult = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [user.name, user.email, hashedPassword, user.role],
  );

  return insertResult.rows[0];
}

async function ensureBorrower(user, createdUser) {
  if (user.role === 'admin') return;

  await pool.query(
    `
      INSERT INTO borrowers (name, phone, address, user_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id)
      WHERE user_id IS NOT NULL
      DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address
    `,
    [user.name, user.phone, user.address, createdUser.id],
  );
}

async function seedInitialUsers() {
  try {
    for (const user of seedUsers) {
      const createdUser = await upsertUser(user);
      await ensureBorrower(user, createdUser);
      console.log(`${user.role} account ready:`, createdUser);
    }

    console.log('\nLogin credentials:');
    seedUsers.forEach((user) => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });
  } catch (error) {
    console.error('Error seeding initial users:', error.message);
  } finally {
    await pool.end();
  }
}

seedInitialUsers();
