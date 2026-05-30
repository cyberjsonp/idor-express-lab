const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

const challenges = [
    {
        id: 1,
        title: 'IDOR - Read Other Users Orders',
        category: 'IDOR',
        difficulty: 'Easy',
        description: 'Each user can view their own orders. But can you view orders that belong to other users?',
        endpoint: '/orders',
        hint: 'Try changing the order ID in the URL when viewing order details.',
        flag: 'FLAG{ID0R_R34D_M4ST3R}'
    },
    {
        id: 2,
        title: 'IDOR - Delete Other Users Addresses',
        category: 'IDOR',
        difficulty: 'Medium',
        description: 'Users can delete their own saved addresses. Is it possible to delete someone else\'s address?',
        endpoint: '/profile',
        hint: 'Check the network tab when deleting an address. What parameters are being sent?',
        flag: 'FLAG{WR1T3_ID0R_D3L3T3}'
    },
    {
        id: 3,
        title: 'IDOR - Download Other Users Private Files',
        category: 'IDOR',
        difficulty: 'Hard',
        description: 'Support ticket attachments are protected only by an unguessable ID. Can you access files that belong to other users?',
        endpoint: '/attachments/download/:id',
        hint: 'Create a support ticket, upload a file, then try changing the attachment ID in the download URL. Check the tickets of other users too!',
        flag: 'FLAG{ID0R_F1L3_D0WNL04D}'
    },
        {
        id: 4,
        title: 'IDOR - Hijack Other Users Notification Settings',
        category: 'IDOR',
        difficulty: 'Medium',
        description: 'Users can update their notification email/phone. Can you modify another user\'s subscription to receive their notifications?',
        endpoint: 'PUT /api/subscriptions/update',
        hint: 'Go to Notification Settings, add a subscription, then use browser DevTools to send a PUT request with a different subscription_id.',
        flag: 'FLAG{SUBSCR1PT10N_H1J4CK}'
    },
    {
        id: 5,
        title: 'IDOR - Hidden in Request Body (Checkout Hijack)',
        category: 'IDOR',
        difficulty: 'Hard',
        description: 'During checkout, the shipping_address_id is sent in the request body. Can you use another user\'s address to place your order?',
        endpoint: 'POST /api/checkout',
        hint: 'Go to Shop, open DevTools Network tab, click "Buy Now" on a product. Find the POST request and change the shipping_address_id in the request body.',
        flag: 'FLAG{CH3CK0UT_H1J4CK}'
    }
];

router.get('/challenges', isAuthenticated, (req, res) => {
    res.render('challenges', {
        title: 'Challenges',
        user: req.session.user,
        challenges: challenges,
        success: req.session.success,
        error: req.session.error
    });
    req.session.success = null;
    req.session.error = null;
});

router.post('/api/validate-flag', isAuthenticated, (req, res) => {
    const { challenge_id, submitted_flag } = req.body;
    
    const challenge = challenges.find(c => c.id === parseInt(challenge_id));
    
    if (!challenge) {
        return res.json({ success: false, message: 'Challenge not found' });
    }
    
    if (submitted_flag.trim() === challenge.flag) {
        return res.json({ 
            success: true, 
            message: '🎉 Congratulations! You found the correct flag!' 
        });
    } else {
        return res.json({ 
            success: false, 
            message: '❌ Incorrect flag. Keep trying!' 
        });
    }
});

module.exports = router;