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

            // Find user by email
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).send('Email Tidak ditemukan');
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('Password Salah');
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token });
        } catch (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Error logging in');
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
