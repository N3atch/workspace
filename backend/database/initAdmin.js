const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initAdmin() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vacation_db',
        });

        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            `INSERT INTO users (first_name, last_name, username, password, is_admin) 
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password = VALUES(password)`,
            ['Admin', 'User', 'admin', hashedPassword, true]
        );

        console.log('Admin user initialized successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error initializing admin:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initAdmin();

