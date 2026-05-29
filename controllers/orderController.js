const { db } = require('../config/database');

const orderController = {
    getUserOrders: (req, res) => {
        const userId = req.session.user.id;
        db.all(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY id',
            [userId],
            (err, orders) => {
                if (err) {
                    return res.render('error', {
                        message: 'Error fetching orders',
                        error: err,
                        title: 'Error',
                        layout: 'layout'
                    });
                }
                res.render('orders', {
                    orders,
                    title: 'My Orders',
                    user: req.session.user,
                    layout: 'layout'
                });
            }
        );
    },

    getOrderDetail: (req, res) => {
        const orderId = req.params.id;
        db.get(
            'SELECT orders.*, users.username as owner_name FROM orders JOIN users ON orders.user_id = users.id WHERE orders.id = ?',
            [orderId],
            (err, order) => {
                if (err || !order) {
                    return res.render('error', {
                        message: 'Order not found',
                        error: { status: 404 },
                        title: '404 Not Found',
                        layout: 'layout'
                    });
                }
                res.render('order-detail', {
                    order,
                    title: `Order #${order.id}`,
                    user: req.session.user,
                    layout: 'layout'
                });
            }
        );
    }
};

module.exports = orderController;