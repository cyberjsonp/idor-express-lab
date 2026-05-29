const { db } = require('../config/database');

const authController = {
    loginPage: (req, res) => {
        const error = req.session.error;
        req.session.error = null;
        res.render('login', { error, title: 'Sign In', layout: false });
    },

    login: (req, res) => {
        const { username, password } = req.body;
        db.get(
            'SELECT id, username, role, email FROM users WHERE username = ? AND password = ?',
            [username, password],
            (err, user) => {
                if (err) {
                    req.session.error = 'Database error';
                    return res.redirect('/login');
                }
                if (user) {
                    req.session.user = user;
                    req.session.success = `Welcome back, ${user.username}!`;
                    return res.redirect('/dashboard');
                }
                req.session.error = 'Invalid username or password';
                res.redirect('/login');
            }
        );
    },

    logout: (req, res) => {
        req.session.destroy(() => res.redirect('/login'));
    }
};

module.exports = authController;