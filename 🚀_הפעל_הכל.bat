@echo off
chcp 65001 >nul
title הפעלת מערכת חופשות
color 0A

echo.
echo ═══════════════════════════════════════════════════════════
echo   🚀 הפעלת מערכת חופשות - Vacation System
echo ═══════════════════════════════════════════════════════════
echo.

REM Check if MySQL is running
echo [1/4] בודק MySQL...
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    net start MySQL >nul 2>&1
    if %errorlevel% == 0 (
        echo    ✅ MySQL פועל
    ) else (
        echo    ⚠️  MySQL כבר רץ או לא ניתן להפעיל
    )
) else (
    sc query MySQL80 >nul 2>&1
    if %errorlevel% == 0 (
        net start MySQL80 >nul 2>&1
        echo    ✅ MySQL80 פועל
    ) else (
        echo    ❌ MySQL לא נמצא - צריך להתקין
        echo    💡 פתח: ✅_סיכום_MySQL.md להוראות התקנה
    )
)

echo.
echo [2/4] מפעיל Backend Server...
start "Backend Server" /MIN cmd /c "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul

echo    ✅ Backend Server מופעל (פורט 3001)

echo.
echo [3/4] מפעיל Frontend App...
start "Frontend App" /MIN cmd /c "cd /d %~dp0frontend && npm start"
timeout /t 5 /nobreak >nul

echo    ✅ Frontend App מופעל (פורט 3000)

echo.
echo [4/4] פותח דפדפן...
timeout /t 3 /nobreak >nul
start chrome.exe "http://localhost:3000"

echo    ✅ דפדפן נפתח
echo.

echo ═══════════════════════════════════════════════════════════
echo   ✅ הכל מופעל!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 מה רץ עכשיו:
echo    ✅ Backend Server - http://localhost:3001
echo    ✅ Frontend App - http://localhost:3000
echo    ✅ דפדפן נפתח
echo.
echo ⚠️  חשוב:
echo    - אם MySQL לא רץ, תקבל שגיאת חיבור
echo    - פתח: ✅_סיכום_MySQL.md להוראות התקנת MySQL
echo.
echo 🔑 פרטי התחברות (אחרי יצירת מסד נתונים):
echo    שם משתמש: admin
echo    סיסמה: admin123
echo.
echo 💡 ליצירת מסד נתונים:
echo    cd backend
echo    node setup-database.js
echo.
pause
