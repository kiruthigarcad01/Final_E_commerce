const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth'); 
const { addProduct } = require('/Controller/adminController'); 
const {editProduct } = require('/Controller/adminController')
const { deleteProduct} = require('/Controller/adminController')
const {viewOrders} = require('/Controller/adminController')
const {updateOrderStatus} = require('/Controller/adminController')
const {cancelOrder} = require('/Controller/adminController')
const {filterOrdersByStatus} = require('/Controller/adminController')



router.post('/addProduct', verifyAdmin, addProduct);
router.put('/products/:id', verifyAdmin, editProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);
router.get('/orders', verifyAdmin, viewOrders);
router.put('/orders/:id/status', verifyAdmin, updateOrderStatus);
router.put('/orders/:id/cancel', verifyAdmin, cancelOrder);
router.get('/orders/filter', verifyAdmin, filterOrdersByStatus);


module.exports = router;
