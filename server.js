const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve static files from 'public' directory
app.use(express.static('public'));

// Endpoint to fetch conversion rates
app.get('/api/convert', async (req, res) => {
    const fromCurrency = (req.query.from || 'USD').toUpperCase();
    const toCurrency = (req.query.to || 'MYR').toUpperCase();
    const amount = parseFloat(req.query.amount) || 1;

    try {
        // Fetch exchange rates based on the 'from' currency
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates from external provider');
        }

        const data = await response.json();
        const rate = data.rates[toCurrency];

        if (!rate) {
            return res.status(400).json({ error: `Currency code '${toCurrency}' not supported.` });
        }

        const convertedAmount = (amount * rate).toFixed(2);

        res.json({
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            rate: rate,
            convertedAmount: parseFloat(convertedAmount),
            lastUpdated: data.date
        });
    } catch (error) {
        console.error('Error fetching rates:', error);
        
        // Fallback calculation logic if external API is unreachable
        const fallbackRates = { USD: 1.0, MYR: 4.72, EUR: 0.92, GBP: 0.79, JPY: 155.2, SGD: 1.35 };
        const fromRate = fallbackRates[fromCurrency] || 1.0;
        const toRate = fallbackRates[toCurrency] || 1.0;
        const calculatedRate = toRate / fromRate;

        res.json({
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            rate: calculatedRate,
            convertedAmount: parseFloat((amount * calculatedRate).toFixed(2)),
            note: "Using offline fallback rates"
        });
    }
});

// Root fallback route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forex Converter app listening on port ${PORT}`);
});
