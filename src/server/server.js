const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// MongoDB Connection with direct credentials
const connectDB = async () => {
    try {
        // Use environment variable if available, otherwise use direct credentials
        const mongoURI = "mongodb+srv://mizan:helloworld@cluster0.q5ve3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

        console.log('🔄 Connecting to MongoDB...');

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ MongoDB connected successfully');
        return true;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        return false;
    }
};

// Connect to MongoDB before starting server
connectDB().then(connected => {
    if (!connected) {
        console.log('⚠️ Starting server without MongoDB connection. Some features may not work.');
    }

    // Import Routes
    const memberRoutes = require('./routes/members');
    const depositRoutes = require('./routes/deposits');
    const cowPurchaseRoutes = require('./routes/cowPurchases');

    // Use Routes
    app.use('/api/members', memberRoutes);
    app.use('/api/deposits', depositRoutes);
    app.use('/api/cow-purchases', cowPurchaseRoutes);

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('public'));

        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../../public', 'index.html'));
        });
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send({ message: 'Something went wrong!', error: err.message });
    });

    // Set port and start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}); 