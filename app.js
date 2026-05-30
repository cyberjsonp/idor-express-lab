const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { initializeDatabase } = require('./config/database');

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const orderRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');
const challengeRoutes = require('./routes/challenges');
const ticketRoutes = require('./routes/tickets');
const subscriptionRoutes = require('./routes/subscriptions');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'shopvault-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/', authRoutes);
app.use('/', homeRoutes);
app.use('/', orderRoutes);
app.use('/', profileRoutes);
app.use('/', challengeRoutes);
app.use('/', ticketRoutes);
app.use('/', subscriptionRoutes);
app.use('/', checkoutRoutes);

app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.redirect('/login');
});

app.use((req, res) => {
    res.status(404).render('error', {
        title: '404 Not Found',
        message: 'Page not found',
        error: { status: 404 },
        layout: 'layout'
    });
});

initializeDatabase();

app.listen(PORT, () => {
    console.log('🛒 ShopVault running on http://localhost:' + PORT);
});