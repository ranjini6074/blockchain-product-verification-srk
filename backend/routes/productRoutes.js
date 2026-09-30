const express = require('express');
const {
  registerProduct,
  getAllProducts,
  getProductByCode,
  verifyProduct
} = require('../controllers/productController');

const router = express.Router();

router.post('/products/register', registerProduct);
router.get('/products', getAllProducts);
router.get('/products/:code', getProductByCode);
router.get('/verify/:code', verifyProduct);

module.exports = router;
