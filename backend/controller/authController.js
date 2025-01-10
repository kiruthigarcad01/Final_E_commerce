const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const loginUser = async (req, res) => {
    const { userName, email, password } = req.body;
  
    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }
  
    try {
        const user = await prisma.customer.findUnique({ 
            where: { email } 
        });
  
        if (!user) {
            return res.status(404).json({ error: 'Customer not found' });
        }
  
        const isValid = await bcrypt.compare(password, user.password);
  
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
  
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
  
        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.userName,
                email: user.email 
            }, 
            jwtSecret, 
            { expiresIn: '1h' }
        );
  
        return res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.userName,
                email: user.email
            }
        });
  
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
  };
  
  
  module.exports = {
    loginUser 
  };
  