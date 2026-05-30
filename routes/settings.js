const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

router.get('/settings', isAuthenticated, settingsController.getSettings);
router.post('/api/user/update', isAuthenticated, settingsController.updateSettings);

module.exports = router;