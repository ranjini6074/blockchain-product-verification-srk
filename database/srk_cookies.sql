CREATE DATABASE IF NOT EXISTS srk_cookies;
USE srk_cookies;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','staff','supplier') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    manufacturer VARCHAR(150),
    supplier_id INT,
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    quantity INT DEFAULT 0,
    status ENUM('active','expired','recalled') DEFAULT 'active',
    product_hash VARCHAR(255),
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE verification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    verification_code VARCHAR(100),
    verification_status ENUM('verified','fake','expired','unknown') NOT NULL,
    verified_by INT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE TABLE qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    qr_value TEXT NOT NULL,
    qr_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (full_name, email, password_hash, role)
VALUES
('System Admin', 'admin@srkcookies.com', 'demo_hash', 'admin');

INSERT INTO suppliers (supplier_name, contact_person, phone, email, address)
VALUES
('SRK Ingredients Supply', 'Aisha', '0123456789', 'supplier@srk.com', 'Kuala Lumpur');

INSERT INTO products (
    product_code,
    product_name,
    batch_number,
    category,
    manufacturer,
    supplier_id,
    manufacturing_date,
    expiry_date,
    quantity,
    status,
    product_hash,
    blockchain_tx_hash
)
VALUES (
    'SRK-001',
    'SRK Cookies Classic',
    'B-2026-01',
    'Biscuits',
    'SRK Foods',
    1,
    '2026-01-01',
    '2026-12-31',
    120,
    'active',
    'demo_hash_001',
    '0xdemo123'
);
