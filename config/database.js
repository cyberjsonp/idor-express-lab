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
        
        // 🆕 PRODUCTS TABLE
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            description TEXT,
            image_emoji TEXT
        )`);

        // ========== SEED USERS ==========
        db.run(`INSERT OR IGNORE INTO users VALUES (1,'alice','password123','user','alice@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (2,'bob','password123','user','bob@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (3,'charlie','password123','user','charlie@example.com')`);
        db.run(`INSERT OR IGNORE INTO users VALUES (4,'admin','admin2024!','admin','admin@shopvault.com')`);

        // ========== SEED ORDERS ==========
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (1,1,'MacBook Pro 16"','Order #ORD-001 - Processing','shipped',1)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (2,1,'Wireless Mouse','Order #ORD-002 - Delivered','delivered',2)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (3,2,'Mechanical Keyboard','Order #ORD-003 - In transit','shipped',3)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (4,2,'USB-C Hub','Order #ORD-004 - Delivered','delivered',3)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (5,3,'4K Monitor 27"','Order #ORD-005 - Pending','pending',4)`);
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status, shipping_address_id) VALUES (6,4,'Confidential Document','TOP SECRET - FLAG{ID0R_R34D_M4ST3R}','classified',5)`);

        // ========== SEED ADDRESSES ==========
        db.run(`INSERT OR IGNORE INTO addresses VALUES (1,1,'🏠 Home','123 Main Street, Apt 4B','New York','10001')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (2,1,'🏢 Office','456 Tech Park, Floor 12','San Francisco','94105')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (3,2,'🏠 Home','789 Oak Avenue','Los Angeles','90001')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (4,3,'🏠 Home','321 Pine Road','Chicago','60601')`);
        db.run(`INSERT OR IGNORE INTO addresses VALUES (5,4,'🔒 Admin Safe House','CLASSIFIED - FLAG{WR1T3_ID0R_D3L3T3}','Unknown','00000')`);

        // ========== SEED TICKETS ==========
        db.run(`INSERT OR IGNORE INTO tickets VALUES (1,1,'Order not delivered','My MacBook has not arrived yet.','open')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (2,2,'Wrong item received','I received a keyboard instead of USB hub.','open')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (3,3,'Monitor issue','Dead pixel on my new monitor.','closed')`);
        db.run(`INSERT OR IGNORE INTO tickets VALUES (4,4,'Security audit report','Confidential - Internal review required.','classified')`);

        // ========== SEED ATTACHMENTS ==========
        db.run(`INSERT OR IGNORE INTO attachments VALUES (1,1,1,'receipt.pdf','Receipt for MacBook Pro - Order #ORD-001')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (2,1,1,'shipping_label.pdf','Shipping label - Tracking #TRK12345')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (3,2,2,'wrong_item_photo.png','Photo of wrong keyboard received')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (4,3,3,'monitor_defect.jpg','Photo of dead pixel on monitor')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (5,4,4,'secret_audit.pdf','FLAG{ID0R_F1L3_D0WNL04D}')`);
        db.run(`INSERT OR IGNORE INTO attachments VALUES (6,4,4,'admin_notes.txt','Internal admin notes - Do not share')`);

        // ========== SEED SUBSCRIPTIONS ==========
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (1,1,'alice@example.com','+1555123456',1,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (2,2,'bob@example.com','+1555987654',0,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (3,3,'charlie@example.com','+1555555555',1,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (4,4,'admin@shopvault.com','+1555999999',0,1)`);
        db.run(`INSERT OR IGNORE INTO subscriptions VALUES (5,4,'security@shopvault.com','+1555888888',1,1)`);

        // 🆕 ========== SEED PRODUCTS ==========
        db.run(`INSERT OR IGNORE INTO products VALUES (1,'MacBook Pro 16"',2499.00,'M3 Pro Chip - 18GB RAM','💻')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (2,'AirPods Pro 2',249.00,'Active Noise Cancellation','🎧')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (3,'iPhone 15 Pro',1099.00,'256GB - Titanium','📱')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (4,'Wireless Mouse',79.00,'Ergonomic design','🖱️')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (5,'4K Monitor 27"',499.00,'UHD - HDR10','🖥️')`);
        db.run(`INSERT OR IGNORE INTO products VALUES (6,'Mechanical Keyboard',149.00,'Cherry MX switches','⌨️')`);
    });
    console.log('✅ Database seeded');
}

module.exports = { db, initializeDatabase };