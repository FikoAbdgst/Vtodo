// routes/forgot.js
const express = require('express');
const bcrypt = require('bcryptjs');
const forgot = express.Router();

// Middleware to parse JSON bodies
module.exports = (prisma) => {
    forgot.route('/check-email').post(async (req, res) => {
        try {
            const { email } = req.body
            // Find user by email
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).send('Email Tidak ditemukan');
            }
            res.json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    forgot.route('/check-name').post(async (req, res) => {
        try {
            const { email, name } = req.body;

            // Periksa apakah email dan nama diberikan dalam request
            if (!email || !name) {
                return res.status(400).send('Email dan nama harus disertakan');
            }

            // Temukan pengguna berdasarkan email dan cocokan dengan nama
            const user = await prisma.user.findUnique({
                where: { email },
                select: { name: true } // Pilih hanya nama
            });

            if (!user) {
                return res.status(400).send('Pengguna tidak ditemukan dengan email yang diberikan.');
            }

            if (user.name !== name) {
                return res.status(400).send('Nama tidak cocok dengan email.');
            }

            res.json({ message: 'Nama cocok. Silakan lanjutkan.' });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });

    forgot.route('/change-password').post(async (req, res) => {
        try {
            const { email, name, newPassword } = req.body;

            // Log the request body for debugging
            console.log('Request body:', req.body);

            // Check for missing fields
            if (!email || !name || !newPassword) {
                return res.status(400).send('Email, name, and new password must be provided');
            }

            // Find the user by email
            const user = await prisma.user.findUnique({
                where: { email },
                select: { name: true, password: true }  // We fetch name and password fields
            });

            // If no user found or the name doesn't match
            if (!user || user.name !== name) {
                return res.status(400).send('User not found or name does not match.');
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });

            // Respond with success
            res.json({ message: 'Password successfully updated.' });
        } catch (error) {
            // Log the error for debugging
            console.error('Error updating password:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    });



    return forgot
};
// const email = req.query.email;
// if (!email) return res.status(400).json({ message: 'Email is required.' });

// try {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (user) {
//         res.json({ email: user.email, name: user.name });
//     } else {
//         res.status(404).json({ message: 'User not found.' });
//     }
// } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Internal server error.' });
// }



// // Change password
// router.post('/change-password', async (req, res) => {
//     const { email, name, oldPassword, newPassword } = req.body;

//     if (!email || !name || !oldPassword || !newPassword) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     try {
//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user || user.name !== name) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Check old password
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Old password is incorrect.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the user's password
//         await prisma.user.update({
//             where: { email },
//             data: { password: hashedPassword }
//         });

//         res.json({ success: true, message: 'Password changed successfully!' });
//     } catch (error) {
//         console.error('Error changing password:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });


