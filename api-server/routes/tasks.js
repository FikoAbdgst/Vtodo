const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const tasks = express.Router();

module.exports = (prisma) => {
    // Create a new task (Protected Route)
    tasks.route('/create').post(authMiddleware, async (req, res) => {
        try {
            const { name, category, date, time } = req.body;

            const dateTime = new Date(date);
            const currentTime = new Date();
            const timeString = time || `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

            const newTask = await prisma.todo.create({
                data: {
                    name,
                    category,
                    note: '', // Optional: Provide default value if needed
                    date: dateTime,
                    time: timeString,
                },
            });

            console.log(newTask);
            res.send('Task Created');
        } catch (err) {
            console.error('Error creating task:', err);
            res.status(500).send('Error creating task');
        }
    });

    // Add other routes (Get, Update, Delete)...

    return tasks;
};
