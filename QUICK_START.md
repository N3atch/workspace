# מדריך התחלה מהירה

## התקנה מהירה (5 דקות)

### 1. Backend Setup
```bash
cd backend
npm install
# צור קובץ .env עם הפרטים שלך
# הרץ את schema.sql ב-MySQL
node database/initAdmin.js
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# צור קובץ .env עם:
# REACT_APP_API_URL=http://localhost:3001/api
# REACT_APP_SOCKET_URL=http://localhost:3001
npm start
```

### 3. התחברות
- **אדמין**: username: `admin`, password: `admin123`
- **משתמש חדש**: הירשם דרך דף ההרשמה

## מבנה הקבצים העיקריים

### Backend
- `server.js` - נקודת הכניסה של השרת
- `routes/` - כל ה-API endpoints
- `middleware/auth.js` - אימות JWT
- `database/schema.sql` - סכמת מסד הנתונים

### Frontend
- `App.tsx` - רכיב ראשי עם routing
- `components/auth/` - דפי התחברות והרשמה
- `components/vacations/` - דף חופשות למשתמש
- `components/admin/` - דפי ניהול ודוחות
- `store/` - Redux store ו-slices
- `services/` - שירותים ל-API ו-Socket.io

## תכונות עיקריות

✅ התחברות והרשמה  
✅ עקיבה אחרי חופשות  
✅ עדכונים בזמן אמת (Socket.io)  
✅ ניהול חופשות (אדמין)  
✅ העלאת תמונות  
✅ דוחות עם גרפים  

## פתרון בעיות נפוצות

**שגיאת חיבור למסד נתונים:**
- ודא ש-MySQL פועל
- בדוק את פרטי החיבור ב-`.env`

**תמונות לא נטענות:**
- ודא שתיקיית `upload` קיימת
- בדוק שהשרת משרת קבצים סטטיים

**Socket.io לא עובד:**
- ודא שהשרת רץ על פורט 3001
- בדוק את הגדרות CORS

