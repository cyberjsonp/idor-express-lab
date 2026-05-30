const { db } = require('../config/database');

const checkoutController = {
    // صفحه فروشگاه — لیست محصولات
    getShop: (req, res) => {
        const userId = req.session.user.id;
        db.all('SELECT * FROM products', [], (err, products) => {
            db.all('SELECT * FROM addresses WHERE user_id = ?', [userId], (err2, addresses) => {
                res.render('shop', {
                    products: products || [],
                    addresses: addresses || [],
                    title: 'Shop',
                    user: req.session.user,
                    success: req.session.success,
                    error: req.session.error,
                    layout: 'layout'
                });
                req.session.success = null;
                req.session.error = null;
            });
        });
    },

    // ⚠️ تسویه‌حساب — آسیب‌پذیر به IDOR روی shipping_address_id!
    checkout: (req, res) => {
        const userId = req.session.user.id;
        const { product_id, coupon, shipping_address_id } = req.body;

        if (!product_id || !shipping_address_id) {
            return res.json({ success: false, message: 'product_id and shipping_address_id are required' });
        }

        // ⚠️ VULNERABLE: آدرس رو بدون چک کردن مالکیت می‌پذیریم!
        // کد امن باید: SELECT * FROM addresses WHERE id = ? AND user_id = ?
        db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
            if (err || !product) {
                return res.json({ success: false, message: 'Product not found' });
            }

            db.get('SELECT * FROM addresses WHERE id = ?', [shipping_address_id], (err, address) => {
                if (err || !address) {
                    return res.json({ success: false, message: 'Address not found' });
                }

                // ساخت سفارش جدید
                const details = `Order for ${product.name}${coupon ? ' (Coupon: ' + coupon + ')' : ''}`;
                db.run(
                    'INSERT INTO orders (user_id, product, details, status, shipping_address_id) VALUES (?, ?, ?, ?, ?)',
                    [userId, product.name, details, 'pending', shipping_address_id],
                    function(err) {
                        if (err) {
                            return res.json({ success: false, message: 'Checkout failed' });
                        }
                        // برگردوندن اطلاعات کامل
                        res.json({
                            success: true,
                            message: 'Order placed successfully!',
                            order: {
                                id: this.lastID,
                                product: product.name,
                                shipping_address: address.full_address,
                                city: address.city,
                                postal_code: address.postal_code,
                                owner_of_address: address.user_id
                            }
                        });
                    }
                );
            });
        });
    }
};

module.exports = checkoutController;