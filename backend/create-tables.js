// Create tables directly
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
    let connection;
    try {
        console.log('═══════════════════════════════════════════════════════');
        console.log('  🚀 יצירת טבלאות מסד נתונים');
        console.log('═══════════════════════════════════════════════════════\n');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vacation_db',
        });

        console.log('✅ התחברות למסד הנתונים הצליחה!\n');

        // Create users table
        console.log('שלב 1: יצירת טבלת users...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ טבלת users נוצרה!\n');

        // Create vacations table
        console.log('שלב 2: יצירת טבלת vacations...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vacations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description TEXT NOT NULL,
                destination VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                followers_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ טבלת vacations נוצרה!\n');

        // Create follows table
        console.log('שלב 3: יצירת טבלת follows...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS follows (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                vacation_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (vacation_id) REFERENCES vacations(id) ON DELETE CASCADE,
                UNIQUE KEY unique_follow (user_id, vacation_id)
            )
        `);
        console.log('✅ טבלת follows נוצרה!\n');

        // Create indexes
        console.log('שלב 4: יצירת אינדקסים...');
        try {
            await connection.execute('CREATE INDEX idx_follows_user ON follows(user_id)');
        } catch (e) {
            if (!e.message.includes('Duplicate key')) console.log('⚠️  idx_follows_user:', e.message);
        }
        
        try {
            await connection.execute('CREATE INDEX idx_follows_vacation ON follows(vacation_id)');
        } catch (e) {
            if (!e.message.includes('Duplicate key')) console.log('⚠️  idx_follows_vacation:', e.message);
        }
        
        try {
            await connection.execute('CREATE INDEX idx_vacations_dates ON vacations(start_date, end_date)');
        } catch (e) {
            if (!e.message.includes('Duplicate key')) console.log('⚠️  idx_vacations_dates:', e.message);
        }
        console.log('✅ אינדקסים נוצרו!\n');

        console.log('═══════════════════════════════════════════════════════');
        console.log('  ✅ כל הטבלאות נוצרו בהצלחה!');
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.log('\n❌ שגיאה ביצירת טבלאות:\n');
        console.log('❌ שגיאה:', error.message);
        if (error.code) console.log('   קוד שגיאה:', error.code);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createTables();
