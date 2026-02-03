// Automated database setup script
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    try {
        console.log('═══════════════════════════════════════════════════════');
        console.log('  🚀 הגדרת מסד נתונים אוטומטית');
        console.log('═══════════════════════════════════════════════════════\n');

        // Step 1: Connect without database (to create it)
        console.log('שלב 1: התחברות ל-MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        console.log('✅ התחברות הצליחה!\n');

        // Step 2: Create database
        console.log('שלב 2: יצירת מסד נתונים...');
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'vacation_db'}`);
        console.log('✅ מסד הנתונים נוצר!\n');

        // Step 3: Use the database
        await connection.execute(`USE ${process.env.DB_NAME || 'vacation_db'}`);

        // Step 4: Read and execute schema
        console.log('שלב 3: יצירת טבלאות...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolons and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

        for (const statement of statements) {
            if (statement.toLowerCase().includes('create table') || 
                statement.toLowerCase().includes('create index') ||
                statement.toLowerCase().includes('alter table')) {
                try {
                    await connection.execute(statement);
                } catch (err) {
                    // Ignore "table already exists" errors
                    if (!err.message.includes('already exists')) {
                        console.log('⚠️  Warning:', err.message);
                    }
                }
            }
        }

        console.log('✅ טבלאות נוצרו!\n');

        // Step 5: Create admin user
        console.log('שלב 4: יצירת משתמש אדמין...');
        const bcrypt = require('bcryptjs');
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            `INSERT INTO users (first_name, last_name, username, password, is_admin) 
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password = VALUES(password), is_admin = VALUES(is_admin)`,
            ['Admin', 'User', 'admin', hashedPassword, true]
        );

        console.log('✅ משתמש אדמין נוצר!');
        console.log('   שם משתמש: admin');
        console.log('   סיסמה: admin123\n');

        console.log('═══════════════════════════════════════════════════════');
        console.log('  ✅ הכל מוכן! מסד הנתונים מוכן לשימוש');
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.log('\n❌ שגיאה בהגדרת מסד הנתונים:\n');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ לא ניתן להתחבר ל-MySQL!');
            console.log('   ודא ש-MySQL רץ ופועל.\n');
            console.log('   אפשרויות:');
            console.log('   1. פתח MySQL Workbench');
            console.log('   2. או הרץ MySQL Service ב-Services');
            console.log('   3. או הרץ: net start MySQL (ב-CMD כמנהל)');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('❌ גישה נדחתה!');
            console.log('   בדוק את הסיסמה בקובץ backend/.env');
            console.log('   עדכן את DB_PASSWORD אם יש סיסמה\n');
        } else {
            console.log('❌ שגיאה:', error.message);
            console.log('   קוד שגיאה:', error.code);
        }
        
        console.log('\n💡 פתרון ידני:');
        console.log('   1. פתח MySQL Workbench');
        console.log('   2. פתח את הקובץ: backend/database/schema.sql');
        console.log('   3. העתק והרץ את כל התוכן ב-MySQL');
        console.log('   4. הרץ: node database/initAdmin.js\n');
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();
