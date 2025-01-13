const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const addProduct = async (req, res) => {
    try {
        const { name, price, description, ratings, images, category, seller, stock, review } = req.body;

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price), // Ensure price is a float
                description,
                ratings: parseFloat(ratings), // Ensure ratings is a float
                images,
                category: category.toUpperCase(), // Convert category to uppercase
                seller,
                stock: parseInt(stock, 10), // Ensure stock is an integer
                review,
            },
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    } finally {
        await prisma.$disconnect();
    }
};

// Update Product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, ratings, images, category, seller, stock, review } = req.body;

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id, 10) }, // Ensure the ID is an integer
            data: {
                name,
                price: price ? parseFloat(price) : undefined,
                description,
                ratings: ratings ? parseFloat(ratings) : undefined,
                images,
                category: category ? category.toUpperCase() : undefined,
                seller,
                stock: stock ? parseInt(stock, 10) : undefined,
                review,
            },
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.code === 'P2025') { // Prisma-specific error for "Record to update not found."
            return res.status(404).json({ error: 'Product not found' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    } finally {
        await prisma.$disconnect();
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(id, 10) }, // Ensure the ID is an integer
        });

        res.json({
            success: true,
            message: 'Product deleted successfully',
            product: deletedProduct,
        });
    } catch (error) {
        if (error.code === 'P2025') { // Prisma-specific error for "Record to delete not found."
            return res.status(404).json({
                success: false,
                message: 'No product found with the provided ID',
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = { addProduct, updateProduct, deleteProduct };          