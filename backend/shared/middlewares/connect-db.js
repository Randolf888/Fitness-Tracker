const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_URL || process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    if (!mongoURI) {
      throw new Error('Missing DB_URL/MONGO_URI. Ensure it is defined in your .env file.');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (dbName) {
      options.dbName = dbName;
    }

    await mongoose.connect(mongoURI, options);

    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
