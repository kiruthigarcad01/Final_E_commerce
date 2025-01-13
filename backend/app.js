const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors'); 


const authRoutes = require('./router/authRoutes');
const adminRoutes = require('./router/adminRoutes');
const customerRoutes = require('./router/customerRoutes');

app.use(express.json());


app.use(cors());


const publicPath = path.join(__dirname, 'public'); 
app.use(express.static(publicPath)); 


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



