const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// ==================== تنظیمات ====================
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'bug-bounty-lab-secret',
    resave: false,
    saveUninitialized: true
}));

// ==================== دیتابیس ====================
const db = new sqlite3.Database(':memory:'); // دیتابیس موقت توی RAM

db.serialize(() => {
    // جدول کاربران
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        role TEXT
    )`);

    // جدول سفارشات
    db.run(`CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product TEXT,
        details TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // اضافه کردن کاربران
    db.run(`INSERT INTO users (username, password, role) VALUES ('ali', '1234', 'user')`);
    db.run(`INSERT INTO users (username, password, role) VALUES ('sara', '1234', 'user')`);
    db.run(`INSERT INTO users (username, password, role) VALUES ('reza', '1234', 'user')`);
    db.run(`INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')`);

    // اضافه کردن سفارشات
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (1, 'لپتاپ ایسوس', 'سفارش در حال پردازش')`);
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (1, 'موس گیمینگ', 'تحویل داده شد')`);
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (2, 'کیبورد مکانیکال', 'در انبار')`);
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (2, 'هدفون', 'تحویل داده شد')`);
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (3, 'مانیتور ۲۷ اینچ', 'آماده ارسال')`);
    db.run(`INSERT INTO orders (user_id, product, details) VALUES (4, 'فلش مموری محرمانه', 'FLAG{ID0R_M4ST3R_2024}')`);
});

// ==================== میدلور احراز هویت ====================
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// ==================== مسیرها ====================

// صفحه اصلی
app.get('/', isLoggedIn, (req, res) => {
    res.send(`
        <h1>به فروشگاه آنلاین خوش آمدید ${req.session.user.username}!</h1>
        <a href="/orders">📦 مشاهده سفارشات من</a><br>
        <a href="/profile">👤 پروفایل من</a><br>
        <a href="/logout">🚪 خروج</a>
    `);
});

// صفحه لاگین
app.get('/login', (req, res) => {
    res.send(`
        <h1>🔐 ورود به فروشگاه</h1>
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="نام کاربری" required><br><br>
            <input type="password" name="password" placeholder="رمز عبور" required><br><br>
            <button type="submit">ورود</button>
        </form>
        <p><small>راهنمایی: ali:1234 | sara:1234 | reza:1234 | admin:admin123</small></p>
    `);
});

// پردازش لاگین
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (user) {
            req.session.user = user;
            res.redirect('/');
        } else {
            res.send('❌ اطلاعات وارد شده اشتباه است. <a href="/login">بازگشت</a>');
        }
    });
});

// خروج
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// لیست سفارشات کاربر لاگین شده
app.get('/orders', isLoggedIn, (req, res) => {
    const userId = req.session.user.id;
    db.all('SELECT * FROM orders WHERE user_id = ?', [userId], (err, orders) => {
        let html = `<h1>📦 سفارشات شما</h1><a href="/">🏠 صفحه اصلی</a><hr>`;
        orders.forEach(order => {
            html += `<p><strong>${order.product}</strong> - ${order.details} <a href="/orders/${order.id}">🔍 جزئیات</a></p>`;
        });
        res.send(html);
    });
});

// ⚠️ مسیر آسیب‌پذیر IDOR - میتونی ID رو عوض کنی!
app.get('/orders/:id', isLoggedIn, (req, res) => {
    const orderId = req.params.id;
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (order) {
            res.send(`
                <h1>🔍 جزئیات سفارش #${order.id}</h1>
                <p><strong>محصول:</strong> ${order.product}</p>
                <p><strong>جزئیات:</strong> ${order.details}</p>
                <hr>
                <a href="/orders">📦 بازگشت به سفارشات</a>
            `);
        } else {
            res.send('❌ سفارش یافت نشد. <a href="/orders">بازگشت</a>');
        }
    });
});

// ==================== شروع سرور ====================
app.listen(PORT, () => {
    console.log(`🧪 Bug Bounty Lab اجرا شد روی http://localhost:${PORT}`);
});