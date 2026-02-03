# Database Schema Documentation

## Overview
מערכת החופשות משתמשת במסד נתונים MySQL עם 3 טבלאות עיקריות.

## Tables

### 1. users
מכילה מידע על משתמשי המערכת.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | מזהה ייחודי |
| first_name | VARCHAR(100) | NOT NULL | שם פרטי |
| last_name | VARCHAR(100) | NOT NULL | שם משפחה |
| username | VARCHAR(100) | UNIQUE, NOT NULL | שם משתמש (ייחודי) |
| password | VARCHAR(255) | NOT NULL | סיסמה מוצפנת (bcrypt) |
| is_admin | BOOLEAN | DEFAULT FALSE | האם משתמש הוא אדמין |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | תאריך יצירה |

### 2. vacations
מכילה מידע על החופשות במערכת.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | מזהה ייחודי |
| description | TEXT | NOT NULL | תיאור החופשה |
| destination | VARCHAR(255) | NOT NULL | יעד החופשה |
| image | VARCHAR(255) | NULL | נתיב לתמונה |
| start_date | DATE | NOT NULL | תאריך התחלה |
| end_date | DATE | NOT NULL | תאריך סיום |
| price | DECIMAL(10,2) | NOT NULL | מחיר |
| followers_count | INT | DEFAULT 0 | מספר עוקבים |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | תאריך יצירה |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | תאריך עדכון אחרון |

### 3. follows
טבלת קשר many-to-many בין משתמשים לחופשות (עוקבים).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | מזהה ייחודי |
| user_id | INT | FOREIGN KEY → users(id), NOT NULL | מזהה משתמש |
| vacation_id | INT | FOREIGN KEY → vacations(id), NOT NULL | מזהה חופשה |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | תאריך יצירה |

**Constraints:**
- UNIQUE (user_id, vacation_id) - משתמש לא יכול לעקוב אחרי אותה חופשה פעמיים
- FOREIGN KEY עם CASCADE DELETE - מחיקת משתמש או חופשה מוחקת את כל הרשומות הקשורות

## Indexes

1. `idx_follows_user` - על `follows.user_id` לביצועים טובים יותר בחיפוש עוקבים
2. `idx_follows_vacation` - על `follows.vacation_id` לביצועים טובים יותר בחיפוש חופשות
3. `idx_vacations_dates` - על `vacations(start_date, end_date)` לביצועים טובים יותר במיון לפי תאריכים

## Relationships

```
users (1) ────< (many) follows (many) >─── (1) vacations
```

- משתמש יכול לעקוב אחרי מספר חופשות
- חופשה יכולה להיות במעקב על ידי מספר משתמשים
- הקשר מתבצע דרך טבלת `follows`

## Sample Queries

### קבלת כל החופשות עם סטטוס מעקב למשתמש מסוים
```sql
SELECT 
    v.*,
    CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as is_following
FROM vacations v
LEFT JOIN follows f ON v.id = f.vacation_id AND f.user_id = ?
ORDER BY 
    CASE WHEN f.user_id IS NOT NULL THEN 0 ELSE 1 END,
    v.start_date ASC;
```

### דוח חופשות עם מספר עוקבים
```sql
SELECT 
    v.id,
    v.destination as vacation_name,
    COUNT(f.id) as followers_count
FROM vacations v
LEFT JOIN follows f ON v.id = f.vacation_id
GROUP BY v.id, v.destination
HAVING followers_count > 0
ORDER BY followers_count DESC;
```

## Initial Data

לאחר יצירת הטבלאות, יש להריץ את הסקריפט `initAdmin.js` ליצירת משתמש אדמין ראשוני:
- Username: `admin`
- Password: `admin123`

**חשוב**: יש לשנות את הסיסמה בסביבת production!

