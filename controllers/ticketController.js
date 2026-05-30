const { db } = require('../config/database');

const ticketController = {
    getMyTickets: (req, res) => {
        const userId = req.session.user.id;
        db.all(
            'SELECT * FROM tickets WHERE user_id = ? ORDER BY id DESC',
            [userId],
            (err, tickets) => {
                if (err) return res.render('error', { message: 'Error', error: err, title: 'Error', layout: 'layout' });
                res.render('tickets', {
                    tickets: tickets || [],
                    title: 'Support Tickets',
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

    getTicketDetail: (req, res) => {
        const ticketId = req.params.id;
        db.get(
            'SELECT tickets.*, users.username as owner_name FROM tickets JOIN users ON tickets.user_id = users.id WHERE tickets.id = ?',
            [ticketId],
            (err, ticket) => {
                if (err || !ticket) {
                    return res.render('error', { message: 'Ticket not found', error: { status: 404 }, title: '404', layout: 'layout' });
                }
                db.all(
                    'SELECT id, filename FROM attachments WHERE ticket_id = ?',
                    [ticketId],
                    (err, attachments) => {
                        res.render('ticket-detail', {
                            ticket: ticket,
                            attachments: attachments || [],
                            title: `Ticket #${ticket.id}`,
                            user: req.session.user,
                            layout: 'layout'
                        });
                    }
                );
            }
        );
    },

    createTicket: (req, res) => {
        const userId = req.session.user.id;
        const { subject, message } = req.body;
        if (!subject || !message) {
            req.session.error = 'Subject and message are required';
            return res.redirect('/tickets');
        }
        db.run(
            'INSERT INTO tickets (user_id, subject, message) VALUES (?, ?, ?)',
            [userId, subject, message],
            (err) => {
                req.session[err ? 'error' : 'success'] = err ? 'Failed to create ticket' : 'Ticket created!';
                res.redirect('/tickets');
            }
        );
    },

    downloadAttachment: (req, res) => {
        const attachmentId = req.params.id;
        db.get(
            'SELECT * FROM attachments WHERE id = ?',
            [attachmentId],
            (err, attachment) => {
                if (err || !attachment) {
                    return res.render('error', { message: 'File not found', error: { status: 404 }, title: '404', layout: 'layout' });
                }
                res.render('attachment-view', {
                    attachment: attachment,
                    title: attachment.filename,
                    user: req.session.user,
                    layout: 'layout'
                });
            }
        );
    }
};

module.exports = ticketController;