const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const auth = require('./routes/auth');
const customer = require('./routes/customer');
const admin = require('./routes/admin');
app.use(express.json());
app.use(cors());

app.use('/api/v1/',auth);
app.use('/api/v1/',customer);
app.use('/api/v1/',admin);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

