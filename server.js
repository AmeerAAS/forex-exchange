const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

// 1. Serve static files (index.html, JS, CSS) from 'public' folder
app.use(express.static('public'));

// 2. Forex API Endpoint
app.get('/api/rates', async (req, res) => {
    try {
        // Fetch live rates from external provider
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Return JSON response to client
        res.json(data);
    } catch (error) {
        // Fallback mock rates if external API call fails
        res.status(500).json({
            error: "Failed to fetch live rates",
            base: "USD",
            rates: { EUR: 0.92, GBP: 0.79, MYR: 4.72, JPY: 155.2 }
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
