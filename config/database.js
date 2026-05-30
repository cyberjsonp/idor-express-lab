const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

function initializeDatabase() {
    db.serialize(() => {
        // ========== TABLES ==========
        db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', email TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product TEXT, details TEXT, status TEXT DEFAULT 'pending', shipping_address_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS addresses (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, label TEXT, full_address TEXT, city TEXT, postal_code TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, subject TEXT, message TEXT, status TEXT DEFAULT 'open', FOREIGN KEY(user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id INTEGER, user_id INTEGER, filename TEXT, file_content TEXT, FOREIGN KEY(ticket_id) REFERENCES tickets(id), FOREIGN KEY(user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, email TEXT, phone TEXT, sms_enabled INTEGER DEFAULT 0, email_enabled INTEGER DEFAULT 1, FOREIGN KEY(user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT, image_emoji TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS shared_files (id INTEGER PRIMARY KEY AUTOINCREMENT, guid TEXT UNIQUE, owner_id INTEGER, filename TEXT, content TEXT, is_public INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(owner_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS file_shares (id INTEGER PRIMARY KEY AUTOINCREMENT, file_id INTEGER, shared_with_user_id INTEGER, shared_by_user_id INTEGER, FOREIGN KEY(file_id) REFERENCES shared_files(id), FOREIGN KEY(shared_with_user_id) REFERENCES users(id), FOREIGN KEY(shared_by_user_id) REFERENCES users(id))`);
        db.run(`CREATE TABLE IF NOT EXISTS file_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, file_id INTEGER, user_id INTEGER, comment TEXT, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY(file_id) REFERENCES shared_files(id), FOREIGN KEY(user_id) REFERENCES users(id))`);
        
        // 🆕 USER SETTINGS TABLE (برای سناریوی Content-Type bypass)
        db.run(`CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            display_name TEXT,
            email TEXT,
            phone TEXT,
            theme TEXT DEFAULT 'light',
            two_factor_enabled INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // ========== SEED USERS ==========
        db.run(`INSERT OR IGNORE INTO users VALUES (1,'alice','password123','user','alice@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (2,'bob','password123','user','bob@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (3,'charlie','password123','user','charlie@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (4,'admin','admin2024!','admin','admin@shopvault.com')`);

        // ========== SEED ORDERS ==========
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (1,1,'MacBook Pro 16"','Order #ORD-001','shipped',1)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (2,1,'Wireless Mouse','Order #ORD-002','delivered',2)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (3,2,'Mechanical Keyboard','Order #ORD-003','shipped',3)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (4,2,'USB-C Hub','Order #ORD-004','delivered',3)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (5,3,'4K Monitor 27"','Order #ORD-005','pending',4)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (6,4,'Confidential Document','TOP SECRET - FLAG{ID0R_R34D_M4ST3R}','classified',5)`);

        // ========== SEED ADDRESSES ==========
        db.run(`INSERT OR IGNORE INTO addresses VALUES (1,1,'🏠 Home','123 Main Street','New York','10001')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (2,1,'🏢 Office','456 Tech Park','San Francisco','94105')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (3,2,'🏠 Home','789 Oak Avenue','Los Angeles','90001')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (4,3,'🏠 Home','321 Pine Road','Chicago','60601')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (5,4,'🔒 Admin Safe House','CLASSIFIED - FLAG{WR1T3_ID0R_D3L3T3}','Unknown','00000')`);

        // ========== SEED TICKETS ==========
        db.run(`INSERT OR IGNORE INTO tickets VALUES (1,1,'Order not delivered','My MacBook has not arrived yet.','open')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (2,2,'Wrong item received','I received a keyboard instead of USB hub.','open')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (3,3,'Monitor issue','Dead pixel on my new monitor.','closed')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (4,4,'Security audit report','Confidential','classified')`);

        // ========== SEED ATTACHMENTS ==========
        db.run(`INSERT OR IGNORE INTO attachments VALUES (1,1,1,'receipt.pdf','Receipt for MacBook Pro')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (2,1,1,'shipping_label.pdf','Shipping label TRK12345')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (3,2,2,'wrong_item_photo.png','Photo of wrong keyboard')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (4,3,3,'monitor_defect.jpg','Photo of dead pixel')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (5,4,4,'secret_audit.pdf','FLAG{ID0R_F1L3_D0WNL04D}')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (6,4,4,'admin_notes.txt','Internal notes - Do not share')`);

        // ========== SEED SUBSCRIPTIONS ==========
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (1,1,'alice@example.com','+1555123456',1,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (2,2,'bob@example.com','+1555987654',0,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (3,3,'charlie@example.com','+1555555555',1,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (4,4,'admin@shopvault.com','+1555999999',0,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (5,4,'security@shopvault.com','+1555888888',1,1)`);

        // ========== SEED PRODUCTS ==========
        db.run(`INSERT OR IGNORE INTO products VALUES (1,'MacBook Pro 16"',2499,'M3 Pro - 18GB RAM','💻')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (2,'AirPods Pro 2',249,'Active Noise Cancellation','🎧')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (3,'iPhone 15 Pro',1099,'256GB - Titanium','📱')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (4,'Wireless Mouse',79,'Ergonomic','🖱️')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (5,'4K Monitor 27"',499,'UHD HDR10','🖥️')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (6,'Mechanical Keyboard',149,'Cherry MX','⌨️')`);

        // ========== SEED SHARED FILES ==========
        db.run(`INSERT OR IGNORE INTO shared_files VALUES (1,'7b9f3c21-a87b-4561-9e5f-12a34b56c001',1,'project_plan.pdf','Q1 2024 Project Plan - Alice',0,'2024-01-15')`);
        db.run(`INSERT OR IGNORE INTO shared_files VALUES (2,'7b9f3c21-a87b-4561-9e5f-12a34b56c002',2,'budget_2024.xlsx','Annual Budget - Bob',0,'2024-02-20')`);
        db.run(`INSERT OR IGNORE INTO shared_files VALUES (3,'7b9f3c21-a87b-4561-9e5f-12a34b56c003',3,'meeting_notes.docx','Sprint Retro - Charlie',0,'2024-03-10')`);
        db.run(`INSERT OR IGNORE INTO shared_files VALUES (4,'7b9f3c21-a87b-4561-9e5f-12a34b56c999',4,'top_secret_admin.pdf','FLAG{GUID_L34K_CH41N_IDOR}',0,'2024-06-01')`);
        db.run(`INSERT OR IGNORE INTO shared_files VALUES (5,'7b9f3c21-a87b-4561-9e5f-12a34b56c005',1,'design_mockups.fig','UI Mockups - Alice',0,'2024-04-05')`);

        // ========== SEED FILE SHARES ==========
        db.run(`INSERT OR IGNORE INTO file_shares VALUES (1,1,2,1)`);
        db.run(`INSERT OR IGNORE INTO file_shares VALUES (2,2,3,2)`);
        db.run(`INSERT OR IGNORE INTO file_shares VALUES (3,3,1,3)`);
        db.run(`INSERT OR IGNORE INTO file_shares VALUES (4,5,2,1)`);

        // ========== SEED COMMENTS ==========
        db.run(`INSERT OR IGNORE INTO file_comments VALUES (1,1,1,'Looks good!','2024-01-16')`);
        db.run(`INSERT OR IGNORE INTO file_comments VALUES (2,1,2,'Great work Alice!','2024-01-17')`);
        db.run(`INSERT OR IGNORE INTO file_comments VALUES (3,2,2,'Budget approved.','2024-02-21')`);

        // 🆕 ========== SEED USER SETTINGS ==========
        db.run(`INSERT OR IGNORE INTO user_settings VALUES (1,1,'Alice Johnson','alice@example.com','+1555123456','dark',1)`);
        db.run(`INSERT OR IGNORE INTO user_settings VALUES (2,2,'Bob Smith','bob@example.com','+1555987654','light',0)`);
        db.run(`INSERT OR IGNORE INTO user_settings VALUES (3,3,'Charlie Brown','charlie@example.com','+1555555555','dark',1)`);
        db.run(`INSERT OR IGNORE INTO user_settings VALUES (4,4,'System Admin','admin@shopvault.com','+1555999999','dark',1)`);
    });
    console.log('✅ Database seeded');
}

module.exports = { db, initializeDatabase };