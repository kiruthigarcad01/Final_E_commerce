const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    if (isBeforeBirthday) {
      age--;
    }
    return age;
  }
  
  // Create Employee
  const registerUser = async (req, res) => {
    try {
      const { userName, email, countryCode, phoneNumber, location, password, confirmPassword, dob } = req.body;
  
      // Validate required fields
      if (!userName || !email || !countryCode || !phoneNumber || !location || !password || !confirmPassword || !dob) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password and Confirm Password must match' });
      }
  
      const dobDate = new Date(dob);
      if (dobDate > new Date()) {
        return res.status(400).json({ message: 'Date of birth cannot be in the future' });
      }
  
      const age = calculateAge(dobDate);
      if (age < 18) {
        return res.status(400).json({ message: 'Employee must be at least 18 years old' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Check for unique username and email
      const existingUser = await prisma.customer.findUnique({
        where: { email: email },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Employee with the same email or username already exists' });
      }
  
      // Create the new employee in the database
      const newEmployee = await prisma.customer.create({
        data: {
          userName,
          email,
          countryCode,
          phoneNumber,
          location,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          dob: dobDate,
        },
      });
  
      res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json({products});
    } catch (error) {
        console.error('Error browsing products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getSingleProduct = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(req.params.id, 10), 
            },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found with that ID',
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to get Product with that ID',
        });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity, customerId } = req.body;  
    if (!productId || !quantity || !customerId) {
        return res.status(400).json({ message: 'Product ID, quantity, and customer ID are required' });
    }
  
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
        });
  
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
  
        let cart = await prisma.cart.findUnique({
            where: { customerId: customerId },
        });
  
        if (!cart) {
            cart = await prisma.cart.create({
                data: { customerId: customerId },
            });
        }
  
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: parseInt(productId),
                quantity: quantity,
            },
        });
  
        res.status(201).json({ message: 'Product added to cart', cartItem });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  const viewCart = async (req, res) => {
    const { customerId } = req.body; 
  
    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }
  
    try {
        const cart = await prisma.cart.findUnique({
            where: { customerId: customerId },
            include: { items: { include: { product: true } } },
        });
  
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
  
        res.status(200).json(cart.items);  
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  const removeFromCart = async (req, res) => {
    const { cartItemId, customerId } = req.body; 
  
    if (!cartItemId || !customerId) {
        return res.status(400).json({ message: 'Cart item ID and customer ID are required' });
    }
  
    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(cartItemId) },
        });
  
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
  
        const cart = await prisma.cart.findUnique({
            where: { id: cartItem.cartId },
        });
  
        if (cart.customerId !== customerId) {
            return res.status(403).json({ message: 'You do not have permission to remove this item' });
        }
  
        await prisma.cartItem.delete({
            where: { id: parseInt(cartItemId) },
        });
  
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
  const addToWishlist = async (req, res) => {
    const { productId, customerId } = req.body;
  
    if (!productId || !customerId) {
        return res.status(400).json({ message: 'Product ID and Customer ID are required' });
    }
  
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
        });
  
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
  
        const existingWishlist = await prisma.wishlist.findUnique({
            where: { customerId_productId: { customerId: customerId, productId: parseInt(productId) } },
        });
  
        if (existingWishlist) {
            return res.status(409).json({ message: 'Product already in wishlist' });
        }
  
        const wishlist = await prisma.wishlist.create({
            data: {
                customerId: customerId,
                productId: parseInt(productId),
            },
        });
  
        res.status(201).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  const createOrder = async (req, res, next) => {
    try {
        const cartItems = req.body; 

        const amount = parseFloat(
            cartItems.reduce((acc, item) => 
                acc + parseFloat(item.product.price.replace(/,/g, '')) * item.qty, 
                0
            )
        ).toFixed(2);

        const order = await prisma.order.create({
            data: {
                amount: amount, 
                status: 'processing',
                products: {
                    create: cartItems.map((item) => ({
                        productId: item.product.id, 
                        quantity: item.qty,
                    })),
                },
            },
            include: {
                products: true, 
            },
        });

        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.product.id },
                data: { stock: { decrement: item.qty } }, 
            });
        }
        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
        });
    } finally {
        await prisma.$disconnect(); 
    }
};



module.exports = { getProducts, addToCart, viewCart, removeFromCart, addToWishlist, createOrder, registerUser, getSingleProduct };          