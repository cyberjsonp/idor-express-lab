const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/profile', isAuthenticated, profileController.getProfile);
router.post('/api/address/add', isAuthenticated, profileController.addAddress);
router.post('/api/address/delete', isAuthenticated, profileController.deleteAddress);

module.exports = router;