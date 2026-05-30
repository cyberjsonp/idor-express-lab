const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const fileShareController = require('../controllers/fileShareController');

router.get('/files', isAuthenticated, fileShareController.getMyFiles);
router.get('/share/:guid', isAuthenticated, fileShareController.viewFile);
router.post('/api/files/comment', isAuthenticated, fileShareController.addComment);
router.post('/api/files/share', isAuthenticated, fileShareController.shareFile);

module.exports = router;