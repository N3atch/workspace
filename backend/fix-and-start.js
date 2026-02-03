// Fix .env and restart server
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=R37aC7!35
DB_NAME=vacation_db
JWT_SECRET=my-super-secret-key-change-in-production-12345
PORT=3001
FRONTEND_URL=http://localhost:3000
`;

try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ קובץ .env עודכן בהצלחה!');
    console.log('');
    console.log('עכשיו הפעל את השרת:');
    console.log('  npm start');
} catch (error) {
    console.log('❌ שגיאה ביצירת .env:', error.message);
}
