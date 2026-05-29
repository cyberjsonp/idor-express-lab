const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(':memory:');

function initializeDatabase() {
    db.serialize(() => {
        // ==================== USERS TABLE ====================
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // ==================== ORDERS TABLE ====================
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product TEXT NOT NULL,
            details TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // ==================== ADDRESSES TABLE ====================
        db.run(`CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            label TEXT NOT NULL,
            full_address TEXT NOT NULL,
            city TEXT,
            postal_code TEXT,
            is_default INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // ==================== SEED USERS ====================
        db.run(`INSERT OR IGNORE INTO users (id, username, password, role, email) VALUES 
            (1, 'alice', 'password123', 'user', 'alice@example.com'),
            (2, 'bob', 'password123', 'user', 'bob@example.com'),
            (3, 'charlie', 'password123', 'user', 'charlie@example.com'),
            (4, 'admin', 'admin2024!', 'admin', 'admin@shop.com')
        `);

        // ==================== SEED ORDERS ====================
        db.run(`INSERT OR IGNORE INTO orders (id, user_id, product, details, status) VALUES 
            (1, 1, 'MacBook Pro 16"', 'Order #ORD-001 - Processing', 'shipped'),
            (2, 1, 'Wireless Mouse', 'Order #ORD-002 - Delivered', 'delivered'),
            (3, 2, 'Mechanical Keyboard', 'Order #ORD-003 - In transit', 'shipped'),
            (4, 2, 'USB-C Hub', 'Order #ORD-004 - Delivered', 'delivered'),
            (5, 3, '4K Monitor 27"', 'Order #ORD-005 - Pending', 'pending'),
            (6, 4, 'Confidential Document', 'TOP SECRET - FLAG{ID0R_R34D_M4ST3R}', 'classified')
        `);

        // ==================== SEED ADDRESSES ====================
        db.run(`INSERT OR IGNORE INTO addresses (id, user_id, label, full_address, city, postal_code) VALUES 
            (1, 1, '🏠 Home', '123 Main Street, Apt 4B', 'New York', '10001'),
            (2, 1, '🏢 Office', '456 Tech Park, Floor 12', 'San Francisco', '94105'),
            (3, 2, '🏠 Home', '789 Oak Avenue', 'Los Angeles', '90001'),
            (4, 3, '🏠 Home', '321 Pine Road', 'Chicago', '60601'),
            (5, 4, '🔒 Admin Safe House', 'CLASSIFIED LOCATION - FLAG{WR1T3_ID0R_D3L3T3}', 'Unknown', '00000')
        `);
    });

    console.log('✅ Database initialized successfully');
}

module.exports = { db, initializeDatabase };