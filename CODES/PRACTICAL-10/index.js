// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define a port to listen on
const PORT = 3000;

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World From Tushra Panchal!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
