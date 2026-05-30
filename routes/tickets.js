const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');

router.get('/tickets', isAuthenticated, ticketController.getMyTickets);
router.get('/tickets/:id', isAuthenticated, ticketController.getTicketDetail);
router.post('/tickets', isAuthenticated, ticketController.createTicket);
router.get('/attachments/download/:id', isAuthenticated, ticketController.downloadAttachment);

module.exports = router;