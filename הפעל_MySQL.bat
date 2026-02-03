@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 הפעלת MySQL
echo ========================================
echo.

echo בודק שירותי MySQL...
echo.

REM Try to find and start MySQL service
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ נמצא שירות MySQL
    echo מנסה להפעיל...
    net start MySQL
    if %errorlevel% == 0 (
        echo.
        echo ✅ MySQL הופעל בהצלחה!
        goto :setup
    ) else (
        echo.
        echo ⚠️  MySQL כבר רץ או יש בעיה בהפעלה
        sc query MySQL | findstr "STATE"
        goto :setup
    )
)

sc query MySQL80 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ נמצא שירות MySQL80
    echo מנסה להפעיל...
    net start MySQL80
    if %errorlevel% == 0 (
        echo.
        echo ✅ MySQL80 הופעל בהצלחה!
        goto :setup
    ) else (
        echo.
        echo ⚠️  MySQL80 כבר רץ או יש בעיה בהפעלה
        sc query MySQL80 | findstr "STATE"
        goto :setup
    )
)

sc query MySQL57 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ נמצא שירות MySQL57
    echo מנסה להפעיל...
    net start MySQL57
    if %errorlevel% == 0 (
        echo.
        echo ✅ MySQL57 הופעל בהצלחה!
        goto :setup
    ) else (
        echo.
        echo ⚠️  MySQL57 כבר רץ או יש בעיה בהפעלה
        sc query MySQL57 | findstr "STATE"
        goto :setup
    )
)

echo.
echo ❌ לא נמצא שירות MySQL!
echo.
echo אפשרויות:
echo 1. MySQL לא מותקן - צריך להתקין
echo 2. MySQL מותקן אבל לא כשירות Windows
echo.
echo פתרון:
echo 1. פתח MySQL Workbench
echo 2. או פתח Services (Win+R, services.msc)
echo 3. חפש MySQL והפעל ידנית
echo.
pause
exit

:setup
echo.
echo ========================================
echo   📦 יצירת מסד נתונים
echo ========================================
echo.

cd backend
if exist setup-database.js (
    echo מריץ setup-database.js...
    node setup-database.js
    if %errorlevel% == 0 (
        echo.
        echo ✅ מסד הנתונים נוצר בהצלחה!
        echo.
        echo ========================================
        echo   ✅ הכל מוכן!
        echo ========================================
        echo.
        echo עכשיו תוכל להתחבר עם:
        echo   שם משתמש: admin
        echo   סיסמה: admin123
        echo.
    ) else (
        echo.
        echo ❌ שגיאה ביצירת מסד הנתונים
        echo בדוק את הלוגים למעלה
    )
) else (
    echo ❌ קובץ setup-database.js לא נמצא
)

echo.
pause
