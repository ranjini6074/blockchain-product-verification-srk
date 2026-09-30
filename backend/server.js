const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SRK Cookies Product Verification API is running');
});

app.use('/api', productRoutes);
app.use('/api/blockchain', blockchainRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
