const express = require('express');
const path = require('path');

const app = express();
const PORT = 5050;

// serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// serve assets explicitly
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// start the server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});