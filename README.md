# SRK Cookies Product Verification System

A blockchain-based product verification system for SRK Cookies that combines:
- MySQL database for product records and expiry dates
- Ganache-based Ethereum blockchain for tamper-proof verification
- Node.js backend for API integration
- Static frontend for product registration and verification
- QR code generator for quick product validation

## Project Overview

This system helps verify whether a product is:
- authentic
- expired
- fake or tampered
- available in the database

It is designed as a strong FYP/demonstration project for a university panel.

## Tech Stack
- Backend: Node.js + Express
- Database: MySQL
- Blockchain: Ganache + Solidity + Web3
- Frontend: HTML + CSS + JavaScript
- QR: Python + qrcode

## Folder Structure

```text
srk-cookies/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── blockchainController.js
│   │   └── productController.js
│   ├── routes/
│   │   ├── blockchainRoutes.js
│   │   └── productRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   └── srk_cookies.sql
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── qr/
│   └── generate_qr.py
├── smart-contracts/
│   └── ProductVerification.sol
└── README.md
```

## Installation Steps

### 1. Install Tools

Install the following:
- Node.js
- MySQL
- Ganache
- Truffle
- MetaMask
- VS Code
- Python

### 2. Create MySQL Database

Open MySQL Workbench or MySQL CLI and run:

```sql
SOURCE database/srk_cookies.sql;
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=srk_cookies
PORT=5000
GANACHE_URL=http://127.0.0.1:7545
PRIVATE_KEY=your_ganache_private_key
CONTRACT_ADDRESS=0x...
```

### 5. Start Backend

```bash
cd backend
npm start
```

### 6. Deploy Smart Contract (Ganache)

Install Truffle:

```bash
npm install -g truffle
```

Create a Truffle project in a folder and copy the Solidity contract:

```bash
truffle init
```

Place the contract in `contracts/ProductVerification.sol` and deploy with:

```bash
truffle migrate --network development
```

### 7. Open Frontend

Open `frontend/index.html` using a local web server or VS Code Live Server.

### 8. Generate QR

```bash
cd qr
python generate_qr.py
```

## Core Features

- Product registration with expiry date
- Blockchain hashing support
- MySQL persistence for product records
- Product verification by code
- Expiry validation
- Fake product detection
- QR code generation

## API Endpoints

### Product endpoints
- `POST /api/products/register`
- `GET /api/products`
- `GET /api/products/:code`
- `GET /api/verify/:code`

### Blockchain endpoints
- `POST /api/blockchain/register`
- `GET /api/blockchain/verify/:code`

## Demo Flow for Lecturer

1. Open Ganache and show blockchain network
2. Show MySQL database with product tables
3. Register a product in the frontend
4. Show generated hash and blockchain transaction
5. Verify the product by entering product code
6. Show expired or fake product behavior
7. Display the QR code generation

## Sample Product Data

```text
Product Code: SRK-001
Product Name: SRK Cookies Classic
Batch Number: B-2026-01
Expiry Date: 2026-12-31
```

## Important Notes

- Use Ganache for local blockchain simulation
- MetaMask can be connected to the local Ganache network
- Keep the backend running before testing the frontend
- Make sure MySQL is started before registering products

## Viva Script Summary

This project uses blockchain to verify product authenticity and track expiry details. Product information is stored in a MySQL database, while a hash of the product is stored on a local blockchain for tamper-proof validation. Users can scan a QR code or enter a product code to verify whether the item is genuine, expired, or fake.

## License

MIT
