const express = require('express')

const router = express.Router();

const { addToCart, viewCart,removeFromCart, addToWishlist, registerUser, getProducts, getSingleProduct, createOrder } = require('../controller/customerController');  
  

  router.get('/getproducts', getProducts);
  router.get('/product/:id', getSingleProduct);
  router.post('/cart/add', addToCart);
  router.get('/viewcart', viewCart);
  router.delete('/cart/remove', removeFromCart);
  router.post('/wishlist/add', addToWishlist);
  router.post('/order', createOrder);
  router.post('/create-employee', registerUser);
  

module.exports = router;