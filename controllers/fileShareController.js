const { db } = require('../config/database');

const fileShareController = {
    getMyFiles: (req, res) => {
        const userId = req.session.user.id;

        db.all(
            'SELECT * FROM shared_files WHERE owner_id = ? ORDER BY id',
            [userId],
            (err, myFiles) => {
                if (err) return res.render('error', { message: 'Error', error: err, title: 'Error', layout: 'layout' });

                db.all(
                    `SELECT sf.*, u.username as owner_name 
                     FROM shared_files sf 
                     JOIN file_shares fs ON sf.id = fs.file_id 
                     JOIN users u ON sf.owner_id = u.id 
                     WHERE fs.shared_with_user_id = ?`,
                    [userId],
                    (err, sharedWithMe) => {
                        res.render('fileshare', {
                            myFiles: myFiles || [],
                            sharedWithMe: sharedWithMe || [],
                            title: 'Shared Files',
                            user: req.session.user,
                            success: req.session.success,
                            error: req.session.error,
                            layout: 'layout'
                        });
                        req.session.success = null;
                        req.session.error = null;
                    }
                );
            }
        );
    },

    viewFile: (req, res) => {
        const guid = req.params.guid;
        
        db.get(
            'SELECT sf.*, u.username as owner_name FROM shared_files sf JOIN users u ON sf.owner_id = u.id WHERE sf.guid = ?',
            [guid],
            (err, file) => {
                if (err || !file) {
                    return res.render('error', { message: 'File not found', error: { status: 404 }, title: '404', layout: 'layout' });
                }

                db.all(
                    `SELECT fc.*, u.username FROM file_comments fc 
                     JOIN users u ON fc.user_id = u.id 
                     WHERE fc.file_id = ? ORDER BY fc.id`,
                    [file.id],
                    (err, comments) => {
                        res.render('file-view', {
                            file: file,
                            comments: comments || [],
                            title: file.filename,
                            user: req.session.user,
                            layout: 'layout'
                        });
                    }
                );
            }
        );
    },

    addComment: (req, res) => {
        const userId = req.session.user.id;
        const { file_id, comment } = req.body;

        if (!comment) {
            return res.json({ success: false, message: 'Comment is required' });
        }

        db.run(
            'INSERT INTO file_comments (file_id, user_id, comment) VALUES (?, ?, ?)',
            [file_id, userId, comment],
            function(err) {
                if (err) return res.json({ success: false, message: 'Error' });

                db.get('SELECT guid, filename FROM shared_files WHERE id = ?', [file_id], (err, file) => {
                    res.json({
                        success: true,
                        message: 'Comment added!',
                        comment_id: this.lastID,
                        file_guid: file.guid,
                        file_name: file.filename,
                        hint: 'The full GUID is now visible. Can you guess other file GUIDs?'
                    });
                });
            }
        );
    },

    shareFile: (req, res) => {
        const userId = req.session.user.id;
        const { file_guid, username } = req.body;

        db.get('SELECT id FROM shared_files WHERE guid = ? AND owner_id = ?', [file_guid, userId], (err, file) => {
            if (err || !file) return res.json({ success: false, message: 'File not found or not yours' });

            db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
                if (err || !user) return res.json({ success: false, message: 'User not found' });

                db.run('INSERT INTO file_shares (file_id, shared_with_user_id, shared_by_user_id) VALUES (?, ?, ?)',
                    [file.id, user.id, userId],
                    (err) => {
                        res.json({ success: !err, message: err ? 'Error' : 'File shared!' });
                    }
                );
            });
        });
    }
};

module.exports = fileShareController;