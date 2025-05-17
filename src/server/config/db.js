const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        // Using the provided credentials directly as a fallback
        const defaultUri = "mongodb+srv://mizan:helloworld@cluster0.q5ve3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

        // Try to get URI from environment or use the default with provided credentials
        const mongoURI = defaultUri;

        if (!mongoURI) {
            throw new Error('MongoDB URI is not defined');
        }

        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // These options help with compatibility
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };

        await mongoose.connect(mongoURI, options);
        console.log('✅ MongoDB Connected Successfully');

        // Get the default connection
        const db = mongoose.connection;

        // Bind connection to error event (to get notification of connection errors)
        db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
        db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
        db.on('reconnected', () => console.log('✅ MongoDB reconnected'));

        return db;
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB; 