const express = require('express');
const app = express();

// OpenShift injects the listening port dynamically via process.env.PORT (defaults to 8080)
const PORT = process.env.PORT || 8080;

// Serve static frontend files from 'public' directory if present
app.use(express.static('public'));

// Sample Forex API route
app.get('/api/rates', (req, res) => {
    res.json({
        base: "USD",
        rates: { EUR: 0.92, GBP: 0.79, MYR: 4.72, JPY: 155.2 }
    });
});

// Fallback home route
app.get('/', (req, res) => {
    res.send('<h1>Forex Exchange Application is Running!</h1>');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
