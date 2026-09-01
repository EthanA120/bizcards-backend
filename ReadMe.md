# BizCards REST API Backend 📇

מערכת שרת (Backend REST API) מלאה ומאובטחת לניהול כרטיסי ביקור עסקיים ומשתמשים, שנבנתה באמצעות **Node.js**, **Express**, ו-**MongoDB / Mongoose**.

---

## 📋 תוכן עניינים
- [תיאור הפרויקט](#-תיאור-הפרויקט)
- [טכנולוגיות וספריות](#-טכנולוגיות-וספריות)
- [התקנה והרצה](#-התקנה-והרצה)
- [משתמשי בדיקה ראשוניים (Seed Data)](#-משתמשי-בדיקה-ראשוניים-seed-data)
- [תיעוד נתיבי ה-API (Endpoints)](#-תיעוד-נתיבי-ה-api-endpoints)
  - [ניהול משתמשים (Users)](#1-ניהול-משתמשים-users)
  - [ניהול כרטיסים (Cards)](#2-ניהול-כרטיסים-cards)
- [פיצ'רים ייחודיים ובונוסים](#-פיצרים-ייחודיים-ובונוסים)
- [מבנה התיקיות בפרויקט](#-מבנה-התיקיות-בפרויקט)

---

## 🚀 תיאור הפרויקט
פרויקט זה מספק שרת API מלא עבור פלטפורמת BizCards. המערכת מאפשרת:
- **משתמשים רגילים**: צפייה בכרטיסים, סימון לייקים/מועדפים, ניהול פרופיל אישי.
- **משתמשים עסקיים (Business)**: יצירה, עריכה, ניהול ומחיקה של כרטיסי ביקור דיגיטליים.
- **מנהלי מערכת (Admin)**: צפייה בכלל המשתמשים, מחיקת משתמשים, מחיקת כרטיסים, ושינוי מספרי עסק (`bizNumber`).

---

## 🛠 טכנולוגיות וספריות
- **Node.js** (ES Modules)
- **Express.js** – תשתית השרת וניהול הניתובים
- **MongoDB & Mongoose** – מסד נתונים NoSQL ומידול סכמות
- **Joi** – אימות ותיקוף נתונים (Validation) בצד השרת
- **Bcryptjs** – הצפנה ואבטחת סיסמאות (Hashing)
- **JsonWebToken (JWT)** – אימות משתמשים וניהול הרשאות (Authentication & Authorization)
- **Morgan & Chalk** – לוגר בקשות מעוצב וצבעוני לקונסול
- **CORS** – הגדרת שיתוף משאבים בין מקורות
- **Config & Dotenv** – ניהול משתני סביבה והגדרות חיבור (לוקאלי / Atlas Cloud)

---

## 💻 התקנה והרצה

### 1. שכפול הפרויקט והתקנת תלויות
```bash
git clone <repository-url>
cd bizcards-backend
npm install
```

### 2. הגדרת משתני סביבה (.env)
צרו קובץ `.env` בשורש הפרויקט (או היעזרו בקובץ ההגדרות `config/default.json`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/BizCards
# עבור חיבור ל-Atlas Cloud ניתן להגדיר כתובת מלאה:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/BizCards
JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRES_IN=4h
```

### 3. הרצת השרת בסביבת פיתוח
```bash
npm run dev
```
ברירת המחדל תפעיל את השרת בכתובת: `http://localhost:5000`

---

## 👥 משתמשי בדיקה ראשוניים (Seed Data)
בעת הפעלת השרת, נטענים באופן אוטומטי 3 משתמשי ברירת מחדל ו-3 כרטיסי ביקור:

| סוג משתמש | אימייל | סיסמה | הרשאות |
| :--- | :--- | :--- | :--- |
| **מנהל (Admin)** | `admin.manager@example.com` | `AdminPassword123!` | אדמין ועסקי (`isAdmin: true`, `isBusiness: true`) |
| **עסקי (Business)** | `david.cohen@example.com` | `BusinessUser123!` | עסקי (`isBusiness: true`) |
| **רגיל (Standard)** | `noa.levi@example.com` | `StandardUser123!` | לקוח רגיל |

---

## 📡 תיעוד נתיבי ה-API (Endpoints)

> 💡 **הערת אימות:** עבור כל הבקשות הדורשות אימות, יש לצרף את הטוקן בכותרת (Header):  
> `x-auth-token: <your_jwt_token>`

### 1. ניהול משתמשים (Users)

| שיטה | נתיב (URL) | הרשאה נדרשת | תיאור |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | כולם (All) | הרשמת משתמש חדש (סיסמה מוצפנת, אימייל ייחודי) |
| `POST` | `/users/login` | כולם (All) | התחברות משתמש וקבלת JWT Token |
| `GET` | `/users` | מנהל בלבד (Admin) | קבלת רשימת כל המשתמשים |
| `GET` | `/users/:id` | בעל החשבון או מנהל | קבלת פרטי משתמש ספציפי |
| `PUT` | `/users/:id` | בעל החשבון בלבד | עריכת פרטי משתמש |
| `PATCH` | `/users/:id` | בעל החשבון בלבד | שינוי סטטוס עסקי (`isBusiness`) |
| `DELETE` | `/users/:id` | בעל החשבון או מנהל | מחיקת משתמש |

#### מבנה אובייקט משתמש לדוגמה (הרשמה - `POST /users`):
```json
{
  "name": {
    "first": "Israel",
    "middle": "A",
    "last": "Israeli"
  },
  "phone": "050-1234567",
  "email": "israel@example.com",
  "password": "Password123!",
  "image": {
    "url": "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
    "alt": "User Avatar"
  },
  "address": {
    "state": "",
    "country": "Israel",
    "city": "Tel Aviv",
    "street": "Dizengoff",
    "houseNumber": 100,
    "zip": 6439602
  },
  "isBusiness": true
}
```

---

### 2. ניהול כרטיסים (Cards)

| שיטה | נתיב (URL) | הרשאה נדרשת | תיאור |
| :--- | :--- | :--- | :--- |
| `GET` | `/cards` | כולם (All) | קבלת כל כרטיסי הביקור במערכת |
| `GET` | `/cards/my-cards` | משתמש מחובר | קבלת הכרטיסים שנוצרו על ידי המשתמש המחובר |
| `GET` | `/cards/:id` | כולם (All) | קבלת כרטיס ביקור לפי מזהה (ID) |
| `POST` | `/cards` | משתמש עסקי (Business) | יצירת כרטיס ביקור חדש (יוצר אוטומטית `bizNumber` ייחודי בן 7 ספרות) |
| `PUT` | `/cards/:id` | יוצר הכרטיס בלבד | עריכת כרטיס ביקור |
| `PATCH` | `/cards/:id` | משתמש מחובר | סימון / הסרת לייק (Toggle Like) |
| `PATCH` | `/cards/:id/bizNumber` | מנהל בלבד (Admin) | **(בונוס)** שינוי מספר עסק (`bizNumber`) |
| `DELETE` | `/cards/:id` | יוצר הכרטיס או מנהל | מחיקת כרטיס ביקור |

#### מבנה אובייקט כרטיס לדוגמה (יצירה - `POST /cards`):
```json
{
  "title": "סטודיו לעיצוב",
  "subtitle": "מיתוג ועיצוב דיגיטלי",
  "description": "שירותי עיצוב גרפי, מיתוג עסקי ובניית אתרים לעסקים קטנים וגדולים.",
  "phone": "052-1234567",
  "email": "studio@design.co.il",
  "web": "https://www.studiodesign.co.il",
  "image": {
    "url": "https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327_960_720.jpg",
    "alt": "Studio Workspace"
  },
  "address": {
    "state": "",
    "country": "Israel",
    "city": "Tel Aviv",
    "street": "Rothschild",
    "houseNumber": 22,
    "zip": 6688101
  }
}
```

---

## 🌟 פיצ'רים ייחודיים ובונוסים
1. **חסימת משתמש (Account Lockout)**: משתמש שמזין סיסמה שגויה 3 פעמים ברציפות נחסם להתחברות למשך 24 שעות.
2. **שינוי מספר עסק (`bizNumber`)**: מנהל מערכת יכול לשנות את ה-`bizNumber` של כרטיס, עם בדיקת וולידציה שהמספר החדש אינו תפוס על ידי כרטיס אחר.
3. **File Logger יומי לשגיאות**: כל שגיאת HTTP (סטטוס 400 ומעלה) נרשמת אוטומטית לקובץ לוג יומי בתיקיית `logs/` (לדוגמה `logs/2026-09-01.log`) עם חותמת זמן, שיטה, URL והודעת שגיאה.
4. **דפי נחיתה ו-404 מותאמים**: תיקיית `public/` מגישה דף בית מעוצב (`index.html`) ודף שגיאה 404 מותאם אישית (`404.html`) בעברית.

---

## 📁 מבנה התיקיות בפרויקט
```text
bizcards-backend/
├── config/
│   └── default.json             # הגדרות ברירת מחדל של מסד הנתונים והטוקן
├── controllers/
│   ├── cardController.js        # לוגיקה עסקית של כרטיסים
│   └── userController.js        # לוגיקה עסקית של משתמשים
├── data/
│   ├── initialCards.json        # נתוני כרטיסים ראשוניים
│   └── initialUsers.json        # נתוני משתמשים ראשוניים
├── logs/                        # תיקיית קבצי לוג שגיאות יומיים
├── middlewares/
│   ├── authMiddleware.js        # מידלוורים לאימות, הרשאות ובדיקת בעלות
│   └── loggerMiddleware.js      # Morgan Console Logger ו-File Logger
├── models/
│   ├── cardModel.js             # Mongoose סכמה ומודל לכרטיסים
│   └── userModel.js             # Mongoose סכמה ומודל למשתמשים
├── public/
│   ├── 404.html                 # דף שגיאה 404 מעוצב
│   └── index.html               # דף נחיתה של שרת ה-API
├── routes/
│   ├── cardsRouter.js           # ניתוב בקשות כרטיסים
│   └── usersRouter.js           # ניתוב בקשות משתמשים
├── services/
│   ├── bcryptService.js         # שירות הצפנת סיסמאות
│   ├── dbService.js             # חיבור למסד הנתונים (Local / Atlas)
│   ├── initialDataService.js    # הזנת נתוני ברירת מחדל (Seed)
│   ├── joiService.js            # חילוץ הודעות שגיאה מ-Joi
│   └── tokenService.js          # יצירה ואימות של JWT Tokens
├── utils/
│   └── errorHandler.js          # טיפול מרכזי בשגיאות שרת ו-Mongoose
├── validators/
│   ├── cardValidation.js        # סכמות Joi עבור כרטיסים
│   └── userValidation.js        # סכמות Joi עבור משתמשים
├── app.js                       # נקודת הכניסה של השרת והגדרת ה-Middlewares
├── package.json
└── ReadMe.md                    # תיעוד הפרויקט
```

