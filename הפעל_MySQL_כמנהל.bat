@echo off
chcp 65001 >nul
echo ========================================
echo   🔐 הפעלת MySQL כמנהל
echo ========================================
echo.
echo ⚠️  סקריפט זה צריך הרשאות מנהל!
echo.
echo אם אתה לא רואה "Running as Administrator" בכותרת:
echo לחץ ימין על הקובץ → Run as administrator
echo.
pause

echo.
echo מנסה להפעיל MySQL...
echo.

REM Try different MySQL service names
for %%s in (MySQL MySQL80 MySQL57) do (
    sc query %%s >nul 2>&1
    if !errorlevel! == 0 (
        echo נמצא שירות: %%s
        net start %%s
        if !errorlevel! == 0 (
            echo.
            echo ✅ %%s הופעל בהצלחה!
            goto :found
        )
    )
)

echo.
echo ❌ לא נמצא שירות MySQL להפעלה
echo.
echo פתרון ידני:
echo 1. לחץ Win+R
echo 2. הקלד: services.msc
echo 3. מצא MySQL והפעל
echo.
pause
exit

:found
echo.
echo ========================================
echo   ✅ MySQL פועל!
echo ========================================
echo.
echo עכשיו הרץ:
echo   cd backend
echo   node setup-database.js
echo.
pause
