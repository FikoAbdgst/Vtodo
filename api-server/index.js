const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const prisma = new PrismaClient();
const auth = require('./routes/auth')(prisma);
const tasks = require('./routes/tasks')(prisma);
const forgots = require('./routes/forgot')(prisma);


app.get('/', (req, res) => {
    res.send('Hello HAHAHAHA');
});

app.use('/auth', auth); // Add auth route for login/register
app.use('/tasks', tasks);
app.use('/forgot', forgots);

app.listen(port, () => {
    console.log('Server running on port 3000');
});
