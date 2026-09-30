const express = require('express');
const {
  registerProductOnBlockchain,
  verifyProductOnBlockchain
} = require('../controllers/blockchainController');

const router = express.Router();

router.post('/register', registerProductOnBlockchain);
router.get('/verify/:code', verifyProductOnBlockchain);

module.exports = router;
