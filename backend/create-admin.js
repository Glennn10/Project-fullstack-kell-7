const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const adminEmail = 'admin@minjemdong.com';
  const adminPassword = 'adminpassword123';
  const adminName = 'Administrator';
  const adminRole = 'admin';

  try {
    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [adminEmail]);

    if (checkResult.rows.length > 0) {
      console.log(`User with email "${adminEmail}" already exists! Upgrading role to admin and resetting password...`);
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const updateQuery = 'UPDATE users SET name = $1, password = $2, role = $3 WHERE email = $4 RETURNING id, name, email, role';
      const updateResult = await pool.query(updateQuery, [adminName, hashedPassword, adminRole, adminEmail]);
      
      console.log('Admin user updated successfully:', updateResult.rows[0]);
      console.log(`Credentials:\nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
    } else {
      console.log(`Creating a new admin user...`);
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role';
      const insertResult = await pool.query(insertQuery, [adminName, adminEmail, hashedPassword, adminRole]);
      
      console.log('Admin user created successfully:', insertResult.rows[0]);
      console.log(`Credentials:\nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
