const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const cors = require('cors');
const app = express();

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Use user routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
