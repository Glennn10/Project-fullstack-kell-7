const cors = require('cors');
const express = require('express');
const path = require('path');
const routes = require('./routes');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to MinjemDong Library API' });
});

app.use('/api', routes);
app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;
