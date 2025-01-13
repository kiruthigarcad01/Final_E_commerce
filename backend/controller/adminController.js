const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const addProduct = async (req, res) => {
    const { name, description, category, price, rating, seller, stock, imageUrl } = req.body;
    const adminId = req.adminId;

  
    if (!name || !description || !category || !price || !rating || !seller || !stock || !imageUrl || !adminId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                category,
                price,
                rating,
                seller,
                stock,
                imageUrl,
                admin: {
                    connect: {
                        id: adminId
                    },
                }
            }
        });

        console.log('Product added:', newProduct);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });

    } catch (error) {
        console.error('Error adding product:', error.message, error.stack);  
        res.status(500).json({ message: 'Internal server error' });
    }
};


const editProduct = async (req, res) => {
  const { id } = req.params; 
  const { name, description, category, price, rating, seller, stock, imageUrl } = req.body;
  const adminId = req.adminId;

  if (!id || !adminId) {
      return res.status(400).json({ message: 'Product ID and admin ID are required' });
  }

  try {
      
      const product = await prisma.product.findUnique({
          where: { id: parseInt(id) },
      });

      if (!product || product.adminId !== adminId) {
          return res.status(403).json({ message: 'Unauthorized to edit this product' });
      }

      
      const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id) },
          data: { name, description, category, price, rating, seller, stock, imageUrl },
      });

      console.log('Product updated:', updatedProduct);
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params; 
  const adminId = req.adminId;

  if (!id || !adminId) {
      return res.status(400).json({ message: 'Product ID and admin ID are required' });
  }

  try {
      
      const product = await prisma.product.findUnique({
          where: { id: parseInt(id) },
      });

      if (!product || product.adminId !== adminId) {
          return res.status(403).json({ message: 'Unauthorized to delete this product' });
      }

      
      await prisma.product.delete({
          where: { id: parseInt(id) },
      });

      console.log('Product deleted:', id);
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



const viewOrders = async (req, res) => {
    try {
        
        const orders = await prisma.order.findMany({
            include: {
                customer: true, 
                products: true, 
            },
        });

        res.status(200).json({ message: 'Orders retrieved successfully', orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    if (!id || !status) {
        return res.status(400).json({ message: 'Order ID and status are required' });
    }

    try {
        
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const cancelOrder = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        
        const canceledOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status: 'Cancelled' },
        });

        res.status(200).json({ message: 'Order cancelled successfully', order: canceledOrder });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const filterOrdersByStatus = async (req, res) => {
    const { status } = req.query; 

    if (!status) {
        return res.status(400).json({ message: 'Status is required for filtering' });
    }

    try {
       
        const filteredOrders = await prisma.order.findMany({
            where: { status },
            include: {
                customer: true,
                products: true,
            },
        });

        res.status(200).json({ message: 'Orders filtered by status', orders: filteredOrders });
    } catch (error) {
        console.error('Error filtering orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { addProduct, editProduct, deleteProduct, viewOrders, updateOrderStatus, cancelOrder, filterOrdersByStatus };

