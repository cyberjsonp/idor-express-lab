const { db } = require('../config/database');

const settingsController = {
    getSettings: (req, res) => {
        const userId = req.session.user.id;
        db.get(
            'SELECT * FROM user_settings WHERE user_id = ?',
            [userId],
            (err, settings) => {
                if (err) return res.render('error', { message: 'Error', error: err, title: 'Error', layout: 'layout' });
                
                db.all(
                    `SELECT us.*, u.username FROM user_settings us JOIN users u ON us.user_id = u.id ORDER BY us.id`,
                    [],
                    (err, allSettings) => {
                        res.render('settings', {
                            settings: settings || {},
                            allSettings: allSettings || [],
                            title: 'Account Settings',
                            user: req.session.user,
                            success: req.session.success,
                            error: req.session.error,
                            layout: 'layout'
                        });
                        req.session.success = null;
                        req.session.error = null;
                    }
                );
            }
        );
    },

    updateSettings: (req, res) => {
        const contentType = req.headers['content-type'] || '';
        
        let user_id, email, display_name, phone;

        if (contentType.includes('application/json')) {
            user_id = req.body.user_id;
            email = req.body.email;
            display_name = req.body.display_name;
            phone = req.body.phone;

            if (parseInt(user_id) !== req.session.user.id) {
                return res.status(403).json({
                    success: false,
                    message: '⛔ Forbidden: You can only update your own settings!',
                    requested_user_id: user_id,
                    your_user_id: req.session.user.id,
                    hint: 'The JSON parser checks authorization...'
                });
            }
        }
        else if (contentType.includes('application/x-www-form-urlencoded')) {
            user_id = req.body.user_id;
            email = req.body.email;
            display_name = req.body.display_name;
            phone = req.body.phone;

        }
        else {
            return res.status(415).json({
                success: false,
                message: 'Unsupported Content-Type. Try application/json or application/x-www-form-urlencoded'
            });
        }

        if (!user_id) {
            return res.json({ success: false, message: 'user_id is required' });
        }

        db.run(
            'UPDATE user_settings SET email = ?, display_name = ?, phone = ? WHERE user_id = ?',
            [email || null, display_name || null, phone || null, user_id],
            function(err) {
                if (err) return res.json({ success: false, message: 'Update failed' });
                if (this.changes > 0) {
                    return res.json({
                        success: true,
                        message: '✅ Settings updated successfully!',
                        updated_user_id: user_id,
                        new_email: email,
                        content_type_used: contentType
                    });
                }
                res.json({ success: false, message: 'User settings not found' });
            }
        );
    }
};

module.exports = settingsController;