const express = require('express');
const category = express.Router();
const dotenv = require('dotenv');

dotenv.config();

module.exports = (prisma) => {
    // Get the secret key from environment variables
    const SECRET_KEY = process.env.SECRET_KEY;


    category.route('/create').post(async (req, res) => {
        try {
            const { name } = req.body;

            const newCategory = await prisma.categories.create({
                data: {
                    name
                },
            });

            res.status(201).json({ message: 'category registered successfully', categoryId: newCategory.id });
        } catch (err) {
            console.error('Error registering category:', err);
            res.status(500).json({ error: 'Error registering category' });
        }
    });

    category.route('/').get(async (req, res) => {
        try {
            const categories = await prisma.categories.findMany();
            res.status(200).json(categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
            res.status(500).json({ error: 'Error fetching categories' });
        }
    });


    return category;
};


