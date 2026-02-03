@echo off
chcp 65001 >nul
echo ========================================
echo   🔧 תיקון שגיאת Internal Server Error
echo ========================================
echo.

echo שלב 1: בדיקת MySQL...
echo.

REM Check if MySQL service exists
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ שירות MySQL נמצא
    echo.
    echo מנסה להפעיל את MySQL...
    net start MySQL >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ MySQL הופעל!
    ) else (
        echo ⚠️  MySQL כבר רץ או יש בעיה בהפעלה
    )
) else (
    echo ❌ שירות MySQL לא נמצא
    echo.
    echo נסה להפעיל ידנית:
    echo 1. לחץ Win+R
    echo 2. הקלד: services.msc
    echo 3. מצא MySQL והפעל
    echo.
    pause
    exit
)

echo.
echo ========================================
echo שלב 2: יצירת מסד נתונים...
echo ========================================
echo.

cd backend
if exist setup-database.js (
    echo מריץ setup-database.js...
    node setup-database.js
    if %errorlevel% == 0 (
        echo.
        echo ✅ מסד הנתונים נוצר בהצלחה!
    ) else (
        echo.
        echo ❌ שגיאה ביצירת מסד הנתונים
        echo.
        echo פתרון ידני:
        echo 1. פתח MySQL Workbench
        echo 2. פתח את: backend/database/schema.sql
        echo 3. הרץ את הקוד ב-MySQL
    )
) else (
    echo ❌ קובץ setup-database.js לא נמצא
)

echo.
echo ========================================
echo שלב 3: בדיקת חיבור...
echo ========================================
echo.

if exist test-connection.js (
    node test-connection.js
)

echo.
echo ========================================
echo   ✅ סיום
echo ========================================
echo.
echo אם הכל עבד:
echo 1. רענן את הדפדפן
echo 2. נסה להתחבר עם admin/admin123
echo.
pause
