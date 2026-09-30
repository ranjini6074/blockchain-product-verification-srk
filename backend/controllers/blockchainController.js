const db = require('../config/db');
const crypto = require('crypto');

exports.registerProductOnBlockchain = async (req, res) => {
  try {
    const { productCode, productName, batchNumber, expiryDate, hashValue } = req.body;

    if (!productCode || !productName || !batchNumber || !expiryDate || !hashValue) {
      return res.status(400).json({ message: 'Missing blockchain payload fields' });
    }

    const txHash = `0x${crypto.randomBytes(16).toString('hex')}`;

    const [rows] = await db.promise().query(
      'SELECT * FROM products WHERE product_code = ?',
      [productCode]
    );

    if (rows.length > 0) {
      await db.promise().query(
        'UPDATE products SET blockchain_tx_hash = ? WHERE product_code = ?',
        [txHash, productCode]
      );
    }

    return res.json({
      success: true,
      txHash,
      message: 'Blockchain registration simulated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Blockchain registration failed', error: error.message });
  }
};

exports.verifyProductOnBlockchain = async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM products WHERE product_code = ?',
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ valid: false, message: 'Product not found on blockchain' });
    }

    const product = rows[0];
    const expectedHash = product.product_hash;

    return res.json({
      valid: true,
      productCode: code,
      hashValue: expectedHash,
      message: 'Blockchain verification succeeded'
    });
  } catch (error) {
    res.status(500).json({ message: 'Blockchain verification failed', error: error.message });
  }
};
