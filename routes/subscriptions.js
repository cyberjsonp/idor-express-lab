const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

router.get('/subscriptions', isAuthenticated, subscriptionController.getSettings);
router.post('/api/subscriptions/add', isAuthenticated, subscriptionController.addSubscription);
router.post('/api/subscriptions/update', isAuthenticated, subscriptionController.updateSubscription);
router.post('/api/subscriptions/delete', isAuthenticated, subscriptionController.deleteSubscription);

module.exports = router;