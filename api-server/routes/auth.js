const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = express.Router();
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = (prisma) => {
    // Get the secret key from environment variables
    const SECRET_KEY = process.env.SECRET_KEY;

    // Register a new user
    // Send JSON error responses
    auth.route('/register').post(async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }

            const passwordStrength = getPasswordStrength(password);
            if (passwordStrength === 'vulnerable') {
                return res.status(400).json({ error: 'Password is too weak' });
            }

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Error registering user' });
        }
    });


    // Login a user
    auth.route('/login').post(async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Find user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // 2. Check if user exists
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // 3. Verify password (assuming you're using bcrypt)
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // 4. Create JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                'your_secret_key',
                { expiresIn: '24h' }
            );

            // 5. Send success response
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (err) {
            // 6. Handle errors
            res.status(500).json({
                success: false,
                message: 'Login Eror!'
            });
        }
    });

    return auth;
};

// Password strength checking function
const getPasswordStrength = (password) => {
    if (password.length < 5) {
        return 'vulnerable';
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return 'normal';
    }
    return 'strong';
};
