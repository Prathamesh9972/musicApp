const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const path = require('path');

const app = express();
connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));


app.get('/', (req, res) => {
  res.send('Welcome to the Music Education API');
});

const PORT = 4200;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
