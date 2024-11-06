const express = require('express');
const path = require('path');

const app = express();
const PORT = 5009;

// serve static files
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile('/var/www/line-dodge/frontend/index.html');
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
