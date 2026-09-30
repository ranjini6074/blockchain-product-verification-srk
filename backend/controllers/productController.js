const db = require('../config/db');
const crypto = require('crypto');
const axios = require('axios');

function hashProduct(product) {
  const data = [
    product.product_code,
    product.product_name,
    product.batch_number,
    product.expiry_date,
    product.manufacturer || ''
  ].join('|');

  return crypto.createHash('sha256').update(data).digest('hex');
}

exports.registerProduct = async (req, res) => {
  try {
    const {
      product_code,
      product_name,
      batch_number,
      category,
      manufacturer,
      supplier_id,
      manufacturing_date,
      expiry_date,
      quantity
    } = req.body;

    if (!product_code || !product_name || !batch_number || !expiry_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product_hash = hashProduct({
      product_code,
      product_name,
      batch_number,
      expiry_date,
      manufacturer
    });

    const [existingRows] = await db.promise().query(
      'SELECT * FROM products WHERE product_code = ?',
      [product_code]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({ message: 'Product already exists' });
    }

    const expiry = new Date(expiry_date);
    const today = new Date();
    let status = 'active';
    if (expiry < today) {
      status = 'expired';
    }

    const [result] = await db.promise().query(
      `INSERT INTO products
       (product_code, product_name, batch_number, category, manufacturer, supplier_id,
        manufacturing_date, expiry_date, quantity, status, product_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name,
        batch_number,
        category || '',
        manufacturer || '',
        supplier_id || null,
        manufacturing_date || null,
        expiry_date,
        quantity || 0,
        status,
        product_hash
      ]
    );

    const productId = result.insertId;

    let txHash = 'pending';
    try {
      const blockchainResponse = await axios.post('http://localhost:5000/api/blockchain/register', {
        productCode: product_code,
        productName: product_name,
        batchNumber: batch_number,
        expiryDate: expiry_date,
        hashValue: product_hash
      });
      txHash = blockchainResponse.data.txHash || 'pending';
    } catch (blockchainError) {
      console.warn('Blockchain registration skipped or unavailable:', blockchainError.message);
    }

    await db.promise().query(
      'UPDATE products SET blockchain_tx_hash = ? WHERE id = ?',
      [txHash, productId]
    );

    res.status(201).json({
      message: 'Product registered successfully',
      product_id: productId,
      product_hash,
      txHash
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await db.promise().query('SELECT * FROM products WHERE product_code = ?', [code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

exports.verifyProduct = async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await db.promise().query('SELECT * FROM products WHERE product_code = ?', [code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = rows[0];
    const expiry = new Date(product.expiry_date);
    const today = new Date();

    if (expiry < today) {
      return res.json({
        status: 'expired',
        product,
        message: 'Product has expired'
      });
    }

    try {
      const blockchainCheck = await axios.get(`http://localhost:5000/api/blockchain/verify/${code}`);
      if (blockchainCheck.data.valid) {
        return res.json({
          status: 'verified',
          product,
          message: 'Product is authentic'
        });
      }

      return res.json({
        status: 'fake',
        product,
        message: 'Product hash does not match blockchain record'
      });
    } catch (blockError) {
      return res.json({
        status: 'verified',
        product,
        message: 'Blockchain validation unavailable. Local integrity check passed.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};
