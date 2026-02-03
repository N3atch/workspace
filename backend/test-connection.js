// Test script to verify database connection and admin user
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    let connection;
    try {
        console.log('Testing database connection...');
        console.log('Host:', process.env.DB_HOST || 'localhost');
        console.log('User:', process.env.DB_USER || 'root');
        console.log('Database:', process.env.DB_NAME || 'vacation_db');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vacation_db',
        });

        console.log('✅ Database connection successful!');

        // Check if admin user exists
        const [users] = await connection.execute(
            'SELECT id, username, is_admin FROM users WHERE username = ?',
            ['admin']
        );

        if (users.length > 0) {
            console.log('✅ Admin user exists!');
            console.log('   Username: admin');
            console.log('   Is Admin: ' + users[0].is_admin);
        } else {
            console.log('⚠️ Admin user not found. Run: node database/initAdmin.js');
        }

        // Check tables
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'users'"
        );
        
        if (tables.length > 0) {
            console.log('✅ Database tables exist!');
        } else {
            console.log('⚠️ Tables not found. Run schema.sql in MySQL first!');
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Cannot connect to MySQL. Make sure MySQL is running!');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('❌ Database not found. Run schema.sql in MySQL first!');
        } else {
            console.log('❌ Error:', error.message);
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testConnection();
