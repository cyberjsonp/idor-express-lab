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