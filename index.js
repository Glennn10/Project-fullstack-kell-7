require('dotenv').config();
const express = require('express');
const app     = express();
const routes  = require('./src/routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: '📚 Backend Perpustakaan berjalan!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});