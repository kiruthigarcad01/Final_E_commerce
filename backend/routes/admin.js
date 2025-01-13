const express = require('express')

const router = express.Router();

const { addProduct, updateProduct, deleteProduct } = require('../controller/adminController');

router.post('/productsCreate', addProduct);
router.put('/productUpdate/:id', updateProduct);
router.delete('/productDelete/:id', deleteProduct);

module.exports = router;

