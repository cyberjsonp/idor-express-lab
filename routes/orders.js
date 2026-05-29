const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/orders', isAuthenticated, orderController.getUserOrders);
router.get('/orders/:id', isAuthenticated, orderController.getOrderDetail);

module.exports = router;