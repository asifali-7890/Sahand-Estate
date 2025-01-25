const express = require('express');

const app = express();

const PORT = 3000;

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send({ name: 'Hello, World!' });
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});