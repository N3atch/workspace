# ⚠️ הוראות הפעלת MySQL

## 🔍 מצב נוכחי:

MySQL **לא נמצא כשירות Windows** במחשב שלך.

---

## 🎯 פתרונות אפשריים:

### פתרון 1: MySQL לא מותקן

אם MySQL לא מותקן על המחשב:

1. **הורד MySQL:**
   - לך ל: https://dev.mysql.com/downloads/installer/
   - בחר: **MySQL Installer for Windows**
   - הורד את הגרסה האחרונה

2. **התקן MySQL:**
   - הרץ את ה-Installer
   - בחר: **Developer Default** או **Server only**
   - במהלך ההתקנה, זכור את הסיסמה שיצרת ל-root

3. **עדכן את `.env`:**
   - פתח: `backend/.env`
   - עדכן: `DB_PASSWORD=הסיסמה_שיצרת`

4. **הרץ:**
   ```bash
   cd backend
   node setup-database.js
   ```

---

### פתרון 2: MySQL מותקן אבל לא כשירות

אם MySQL מותקן אבל לא רץ כשירות Windows:

**דרך א' - דרך MySQL Workbench:**
1. פתח **MySQL Workbench**
2. אם אתה רואה חיבור - MySQL רץ ✅
3. אם לא - לחץ על הכפתור "Start MySQL Server"

**דרך ב' - דרך Command Line:**
1. פתח **Command Prompt** או **PowerShell**
2. עבור לתיקיית MySQL (בדרך כלל):
   ```bash
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   ```
3. הרץ:
   ```bash
   mysqld --install
   net start MySQL
   ```

**דרך ג' - דרך Services:**
1. לחץ `Win + R`
2. הקלד: `services.msc`
3. חפש: `MySQL`, `MySQL80`, `MySQL57`
4. אם נמצא - לחץ ימין → Start
5. אם לא נמצא - MySQL לא מותקן כשירות

---

### פתרון 3: MySQL רץ אבל על פורט אחר

אם MySQL רץ אבל על פורט אחר (לא 3306):

1. בדוק את הפורט של MySQL
2. עדכן את `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3307  # או הפורט שלך
   ```

---

## 🚀 אחרי שהפעלת MySQL:

### שלב 1: בדוק שהכל עובד

```bash
cd Vacation-STUDENT_ID\backend
node test-connection.js
```

צריך לראות:
```
✅ Database connection successful!
```

### שלב 2: צור את מסד הנתונים

```bash
cd Vacation-STUDENT_ID\backend
node setup-database.js
```

זה ייצור:
- מסד הנתונים `vacation_db`
- כל הטבלאות
- משתמש אדמין (admin/admin123)

### שלב 3: נסה להתחבר

1. פתח: http://localhost:3000
2. התחבר עם: `admin` / `admin123`

---

## 🔧 סקריפטים שיצרתי:

1. **הפעל_MySQL.bat** - מנסה להפעיל MySQL אוטומטית
2. **הפעל_MySQL_כמנהל.bat** - הפעלה עם הרשאות מנהל

**להרצה:**
- לחץ ימין על הקובץ → Run as administrator

---

## 📋 בדיקה מהירה:

**בדוק אם MySQL מותקן:**
```powershell
Test-Path "C:\Program Files\MySQL"
Test-Path "C:\Program Files (x86)\MySQL"
```

**בדוק אם MySQL רץ:**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*mysql*"}
```

**בדוק שירותי MySQL:**
```powershell
Get-Service | Where-Object {$_.Name -like "*mysql*"}
```

---

## 💡 טיפים:

- **אם MySQL לא מותקן:** התקן MySQL Community Server (חינמי)
- **אם MySQL מותקן אבל לא רץ:** נסה להפעיל דרך MySQL Workbench
- **אם יש בעיות:** בדוק את הלוגים של MySQL

---

## ✅ סיכום:

**הבעיה:** MySQL לא נמצא כשירות Windows

**פתרונות:**
1. התקן MySQL אם לא מותקן
2. הפעל MySQL דרך MySQL Workbench
3. או הפעל ידנית דרך Services

**אחרי שהפעלת MySQL:**
- הרץ `node setup-database.js`
- נסה להתחבר

**בהצלחה! 🚀**
