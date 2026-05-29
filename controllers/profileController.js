const { db } = require('../config/database');

const profileController = {
    getProfile: (req, res) => {
        const userId = req.session.user.id;
        db.all(
            'SELECT * FROM addresses WHERE user_id = ? ORDER BY id',
            [userId],
            (err, addresses) => {
                if (err) {
                    return res.render('error', {
                        message: 'Error fetching addresses',
                        error: err,
                        title: 'Error',
                        layout: 'layout'
                    });
                }
                res.render('profile', {
                    addresses,
                    title: 'My Profile',
                    user: req.session.user,
                    success: req.session.success,
                    error: req.session.error,
                    layout: 'layout'
                });
                req.session.success = null;
                req.session.error = null;
            }
        );
    },

    addAddress: (req, res) => {
        const userId = req.session.user.id;
        const { label, full_address, city, postal_code } = req.body;

        db.run(
            'INSERT INTO addresses (user_id, label, full_address, city, postal_code) VALUES (?, ?, ?, ?, ?)',
            [userId, label, full_address, city, postal_code],
            (err) => {
                if (err) {
                    req.session.error = 'Failed to add address';
                } else {
                    req.session.success = 'Address added successfully!';
                }
                res.redirect('/profile');
            }
        );
    },

    deleteAddress: (req, res) => {
        const addressId = req.body.address_id;

        db.run(
            'DELETE FROM addresses WHERE id = ?',
            [addressId],
            function(err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Server error' });
                }
                if (this.changes > 0) {
                    return res.json({ success: true, message: 'Address deleted successfully!' });
                }
                res.status(404).json({ success: false, message: 'Address not found' });
            }
        );
    }
};

module.exports = profileController;