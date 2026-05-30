const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const checkoutController = require('../controllers/checkoutController');

router.get('/shop', isAuthenticated, checkoutController.getShop);
router.post('/api/checkout', isAuthenticated, checkoutController.checkout);

module.exports = router;