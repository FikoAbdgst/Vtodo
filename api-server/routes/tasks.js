const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const tasks = express.Router();

module.exports = (prisma) => {
    tasks.route('/create').post(authMiddleware, async (req, res) => {
        try {
            const { name, category, note, date, time } = req.body;
            const userId = req.user.userId;

            // Validasi input
            if (!name || !category || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Kolom wajib tidak boleh kosong'
                });
            }

            const dateTime = new Date(date);
            const currentTime = new Date();

            // Parse time string into hours and minutes
            const [hours, minutes] = time.split(':').map(Number);
            dateTime.setHours(hours, minutes, 0, 0);

            // Tentukan status berdasarkan waktu
            let status = 'scheduled';
            if (dateTime < currentTime) {
                status = 'missed';
            }

            const newTask = await prisma.todo.create({
                data: {
                    name,
                    category,
                    note: note || '',
                    date: dateTime,
                    time: time || currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                    userId: userId,
                    status: status,
                },
            });

            res.status(201).json({
                success: true,
                message: 'Tugas berhasil dibuat',
                task: newTask
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Kesalahan membuat tugas: ' + err.message
            });
        }
    });
    tasks.route('/get_task').get(authMiddleware, async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Count missed tasks
            const missedTasksCount = await prisma.todo.count({
                where: {
                    userId: req.user.userId,
                    date: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: 'missed'
                }
            });
            const scheduledTasksCount = await prisma.todo.count({
                where: {
                    userId: req.user.userId,
                    date: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: 'scheduled'
                }
            });
            const completedTasksCount = await prisma.todo.count({
                where: {
                    userId: req.user.userId,
                    date: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: 'completed'
                }
            });

            // Fetch only scheduled tasks
            const todayTasks = await prisma.todo.findMany({
                where: {
                    userId: req.user.userId,
                    date: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: {
                        in: ['scheduled', 'completed'] // Gunakan operator `in` untuk memfilter kedua status
                    }
                },
                orderBy: [
                    { time: 'asc' },
                    { date: 'asc' }
                ],
                take: 3
            });

            res.status(200).json({
                success: true,
                tasks: todayTasks,
                missedTasksCount: missedTasksCount,
                scheduledTasksCount: scheduledTasksCount,
                completedTasksCount: completedTasksCount,
                count: todayTasks.length
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Kesalahan mengambil tugas: ' + err.message
            });
        }
    });
    // Route untuk memeriksa dan update status task
    tasks.route('/check-task-status').get(authMiddleware, async (req, res) => {
        const currentTime = new Date();
        const userId = req.user.userId;

        try {
            // Update task yang missed
            const updatedTasks = await prisma.todo.updateMany({
                where: {
                    userId: userId,
                    status: 'scheduled',
                    OR: [
                        { date: { lt: currentTime } },
                        {
                            date: { equals: currentTime },
                            time: { lt: currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) }
                        }
                    ]
                },
                data: {
                    status: 'missed'
                }
            });

            res.status(200).json({
                success: true,
                updatedCount: updatedTasks.count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Gagal update status: ' + error.message
            });
        }
    });
    tasks.route('/toggle-status').patch(authMiddleware, async (req, res) => {
        try {
            const { taskId } = req.body;
            const userId = req.user.userId;

            // First, get the current task
            const currentTask = await prisma.todo.findFirst({
                where: {
                    id: taskId,
                    userId: userId
                }
            });

            if (!currentTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Toggle the status
            const newStatus = currentTask.status === 'completed' ? 'scheduled' : 'completed';

            // Update the task
            const updatedTask = await prisma.todo.update({
                where: {
                    id: taskId
                },
                data: {
                    status: newStatus
                }
            });

            res.status(200).json({
                success: true,
                message: 'Task status updated successfully',
                task: updatedTask
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating task status: ' + error.message
            });
        }
    });

    tasks.route('/update/:id').patch(authMiddleware, async (req, res) => {
        try {
            // Konversi id dari string ke integer
            const taskId = parseInt(req.params.id);
            const { name, category, note, date, time } = req.body;
            const userId = req.user.userId;

            // Validate input
            if (!name || !category || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields cannot be empty'
                });
            }

            // Check if task exists and belongs to user
            const existingTask = await prisma.todo.findFirst({
                where: {
                    id: taskId,  // Sekarang taskId sudah bertipe Integer
                    userId: userId
                }
            });

            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            const dateTime = new Date(date);
            const [hours, minutes] = time.split(':').map(Number);
            dateTime.setHours(hours, minutes, 0, 0);

            // Update task
            const updatedTask = await prisma.todo.update({
                where: {
                    id: taskId
                },
                data: {
                    name,
                    category,
                    note: note || '',
                    date: dateTime,
                    time
                }
            });

            res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                task: updatedTask
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating task: ' + error.message
            });
        }
    });

    tasks.route('/delete/:id').delete(authMiddleware, async (req, res) => {
        try {
            // Konversi id dari string ke integer
            const taskId = parseInt(req.params.id);
            const userId = req.user.userId;

            // Check if task exists and belongs to user
            const existingTask = await prisma.todo.findFirst({
                where: {
                    id: taskId,  // Sekarang taskId sudah bertipe Integer
                    userId: userId
                }
            });

            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            // Delete task
            await prisma.todo.delete({
                where: {
                    id: taskId
                }
            });

            res.status(200).json({
                success: true,
                message: 'Task deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting task: ' + error.message
            });
        }
    });

    return tasks;

};