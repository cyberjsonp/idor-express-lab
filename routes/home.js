const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('home', { 
        title: 'Dashboard',
        user: req.session.user,
        success: req.session.success
    });
    req.session.success = null;
});

module.exports = router;