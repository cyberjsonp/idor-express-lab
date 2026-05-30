const { db } = require('../config/database');

const subscriptionController = {
    // نمایش تنظیمات اشتراک کاربر
    getSettings: (req, res) => {
        const userId = req.session.user.id;
        db.all(
            'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id',
            [userId],
            (err, subscriptions) => {
                if (err) return res.render('error', { message: 'Error', error: err, title: 'Error', layout: 'layout' });
                res.render('subscriptions', {
                    subscriptions: subscriptions || [],
                    title: 'Notification Settings',
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

    // افزودن اشتراک جدید
    addSubscription: (req, res) => {
        const userId = req.session.user.id;
        const { email, phone, sms_enabled, email_enabled } = req.body;
        
        if (!email && !phone) {
            req.session.error = 'Email or phone is required';
            return res.redirect('/subscriptions');
        }

        db.run(
            'INSERT INTO subscriptions (user_id, email, phone, sms_enabled, email_enabled) VALUES (?, ?, ?, ?, ?)',
            [userId, email || null, phone || null, sms_enabled ? 1 : 0, email_enabled ? 1 : 0],
            (err) => {
                req.session[err ? 'error' : 'success'] = err ? 'Failed to add' : 'Subscription added!';
                res.redirect('/subscriptions');
            }
        );
    },

    // ⚠️ به‌روزرسانی اشتراک — آسیب‌پذیر به IDOR!
    updateSubscription: (req, res) => {
        const subscriptionId = req.body.subscription_id;
        const email = req.body.email;
        const phone = req.body.phone;

        if (!subscriptionId) {
            return res.json({ success: false, message: 'subscription_id is required' });
        }

        // ⚠️ VULNERABLE: چک نمی‌کنیم این اشتراک مال کاربر لاگین شده هست یا نه!
        // کد امن باید: UPDATE subscriptions SET ... WHERE id = ? AND user_id = ?
        db.run(
            'UPDATE subscriptions SET email = ?, phone = ? WHERE id = ?',
            [email || null, phone || null, subscriptionId],
            function(err) {
                if (err) {
                    return res.json({ success: false, message: 'Update failed' });
                }
                if (this.changes > 0) {
                    return res.json({ success: true, message: 'Subscription updated successfully!' });
                }
                res.json({ success: false, message: 'Subscription not found' });
            }
        );
    },

    // حذف اشتراک (امن — فقط مال خود کاربر)
    deleteSubscription: (req, res) => {
        const subscriptionId = req.body.subscription_id;
        const userId = req.session.user.id;

        // ✅ SECURE: مالکیت چک میشه
        db.run(
            'DELETE FROM subscriptions WHERE id = ? AND user_id = ?',
            [subscriptionId, userId],
            function(err) {
                if (err) return res.json({ success: false, message: 'Error' });
                if (this.changes > 0) return res.json({ success: true, message: 'Deleted!' });
                res.json({ success: false, message: 'Not found or not yours' });
            }
        );
    }
};

module.exports = subscriptionController;