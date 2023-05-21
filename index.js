// index.js

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Remove the deprecated options
});

mongoose.set('debug', true);

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use(require('./Develop/routes'));

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
