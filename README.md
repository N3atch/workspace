<<<<<<< HEAD
# מערכת תיוג חופשות - Vacation Following System

## תיאור הפרויקט
מערכת לתיוג חופשות המאפשרת למשתמשים לצפות בחופשות ולעקוב אחריהן. כאשר אדמין משנה חופשה שהמשתמש עוקב אחריה, השינוי מתעדכן בזמן אמת ללא רענון דף.

## טכנולוגיות
- **Backend**: Node.js + Express + Socket.io
- **Database**: MySQL
- **Frontend**: React + TypeScript + Redux
- **UI**: Bootstrap 5

## מבנה הפרויקט
```
Vacation-STUDENT_ID/
├── backend/          # שרת Node.js
├── frontend/         # אפליקציית React
├── upload/           # תמונות שהועלו
└── README.md
```

## התקנה והרצה

### דרישות מוקדמות
- Node.js (גרסה 14 ומעלה)
- MySQL (גרסה 5.7 ומעלה)
- npm או yarn

### שלב 1: התקנת Backend

1. עבור לתיקיית backend:
```bash
cd backend
```

2. התקן את התלויות:
```bash
npm install
```

3. צור קובץ `.env` בתיקיית backend והעתק את התוכן מ-`.env.example`:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vacation_db
JWT_SECRET=your-secret-key-here
PORT=3001
```

4. צור את מסד הנתונים והטבלאות:
   - פתח MySQL
   - הרץ את הקובץ `database/schema.sql`

5. צור משתמש אדמין:
   ```bash
   node database/initAdmin.js
   ```
   זה ייצור משתמש אדמין עם:
   - שם משתמש: `admin`
   - סיסמה: `admin123`
   - **הערה**: יש לשנות את הסיסמה ב-production!

6. הפעל את השרת:
```bash
npm start
# או לפיתוח עם auto-reload:
npm run dev
```

השרת יפעל על פורט 3001.

### שלב 2: התקנת Frontend

1. פתח טרמינל חדש ועבור לתיקיית frontend:
```bash
cd frontend
```

2. התקן את התלויות:
```bash
npm install
```

3. צור קובץ `.env` בתיקיית frontend:
```bash
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

4. הפעל את האפליקציה:
```bash
npm start
```

האפליקציה תיפתח אוטומטית בדפדפן על פורט 3000.

## שימוש במערכת

### משתמש רגיל
1. הירשם למערכת או התחבר
2. צפה ברשימת החופשות
3. לחץ על "עקוב אחרי" כדי לעקוב אחרי חופשה
4. חופשות שאתה עוקב אחריהן מופיעות ראשונות ברשימה
5. שינויים בחופשות שאתה עוקב אחריהן יתעדכנו בזמן אמת

### אדמין
1. התחבר עם משתמש אדמין (admin/admin123)
2. בדף הראשי תוכל:
   - להוסיף חופשה חדשה (כפתור "הוסף חופשה")
   - לערוך חופשה קיימת (אייקון עיפרון)
   - למחוק חופשה (אייקון X)
3. בדף "דוחות" תוכל לראות גרף של חופשות ומספר העוקבים

## מבנה מסד הנתונים

### טבלת users
- id (INT, PRIMARY KEY)
- first_name (VARCHAR)
- last_name (VARCHAR)
- username (VARCHAR, UNIQUE)
- password (VARCHAR - מוצפן)
- is_admin (BOOLEAN)
- created_at (TIMESTAMP)

### טבלת vacations
- id (INT, PRIMARY KEY)
- description (TEXT)
- destination (VARCHAR)
- image (VARCHAR)
- start_date (DATE)
- end_date (DATE)
- price (DECIMAL)
- followers_count (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### טבלת follows
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- vacation_id (INT, FOREIGN KEY)
- created_at (TIMESTAMP)
- UNIQUE (user_id, vacation_id)

## API Endpoints

### Authentication
- `POST /api/auth/register` - הרשמה
- `POST /api/auth/login` - התחברות

### Vacations
- `GET /api/vacations` - קבלת כל החופשות
- `GET /api/vacations/:id` - קבלת חופשה ספציפית
- `POST /api/vacations` - יצירת חופשה (אדמין בלבד)
- `PUT /api/vacations/:id` - עדכון חופשה (אדמין בלבד)
- `DELETE /api/vacations/:id` - מחיקת חופשה (אדמין בלבד)
- `GET /api/vacations/reports/followers` - דוחות (אדמין בלבד)

### Follows
- `POST /api/follows/:vacationId` - עקוב אחרי חופשה
- `DELETE /api/follows/:vacationId` - הסר מעקב

### Upload
- `POST /api/upload` - העלאת תמונה (אדמין בלבד)

## Socket.io Events

- `vacationUpdated` - נשלח כאשר חופשה מתעדכנת
- `vacationDeleted` - נשלח כאשר חופשה נמחקת
- `vacationCreated` - נשלח כאשר חופשה נוצרת

## הערות חשובות

1. **אבטחה**: בסביבת production יש לשנות את JWT_SECRET ולשמור עליו בסוד
2. **סיסמת אדמין**: יש לשנות את סיסמת האדמין הדיפולטית
3. **תמונות**: תמונות נשמרות בתיקיית `upload` ב-root של הפרויקט
4. **CORS**: השרת מוגדר לקבל בקשות מ-`http://localhost:3000` - יש לעדכן אם משתמשים בפורט אחר

## פתרון בעיות

### שגיאת חיבור למסד נתונים
- ודא ש-MySQL פועל
- בדוק את פרטי החיבור בקובץ `.env`
- ודא שהמסד נתונים `vacation_db` נוצר

### שגיאת CORS
- ודא שהשרת מאזין על הפורט הנכון
- בדוק את הגדרות CORS ב-`server.js`

### תמונות לא נטענות
- ודא שתיקיית `upload` קיימת
- בדוק את נתיב התמונות בקוד

## רישיון
פרויקט זה נוצר למטרות לימודיות.

=======
# workspace
>>>>>>> 7aaff49338636f22b5a7ebf3c61fbb30b3509059
