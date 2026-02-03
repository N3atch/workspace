@echo off
echo ========================================
echo   פתיחת מערכת חופשות בדפדפן
echo ========================================
echo.
echo פותח את הדפדפן...
start chrome.exe "http://localhost:3000"
echo.
echo ========================================
echo   פרטי התחברות:
echo ========================================
echo.
echo שם משתמש: admin
echo סיסמה: admin123
echo.
echo ========================================
echo.
echo אם אתה רואה שגיאת חיבור למסד נתונים:
echo 1. ודא ש-MySQL רץ
echo 2. הרץ את schema.sql ב-MySQL
echo 3. הרץ: node database\initAdmin.js
echo.
pause
