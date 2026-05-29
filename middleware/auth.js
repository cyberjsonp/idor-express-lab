function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.session.error = 'Please login to continue';
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error', { 
        message: 'Access Denied',
        error: { status: 403, stack: 'You do not have permission to access this resource.' }
    });
}

module.exports = { isAuthenticated, isAdmin };