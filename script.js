// Fetch available currencies and populate dropdowns
const apiKey = 'Your_API_Key';
const apiURL = 'https://api.freecurrencyapi.com/v1/latest';

document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies();
    document.getElementById('amount').addEventListener('input', convertCurrency);
    document.getElementById('base-currency').addEventListener('change', convertCurrency);
    document.getElementById('target-currency').addEventListener('change', convertCurrency);
    document.getElementById('historical-rates').addEventListener('click', viewHistoricalRates);
    document.getElementById('save-favorite').addEventListener('click', saveFavoritePair);
});

async function fetchCurrencies() {
    try {
        const response = await fetch(apiURL, {
            headers: {
                'apikey': apiKey
            }
        });
        const data = await response.json();
        populateCurrencyDropdowns(Object.keys(data.data));
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }
}

function populateCurrencyDropdowns(currencies) {
    const baseSelect = document.getElementById('base-currency');
    const targetSelect = document.getElementById('target-currency');
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        baseSelect.appendChild(option);
        targetSelect.appendChild(option.cloneNode(true));
    });
}

async function convertCurrency() {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (!baseCurrency || !targetCurrency || isNaN(amount) || amount <= 0) {
        document.getElementById('converted-amount').textContent = 'Invalid input';
        return;
    }

    try {
        const response = await fetch(`${apiURL}?base_currency=${baseCurrency}`, {
            headers: {
                'apikey': apiKey
            }
        });
        const data = await response.json();
        const rate = data.data[targetCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        document.getElementById('converted-amount').textContent = `${convertedAmount} ${targetCurrency}`;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        document.getElementById('converted-amount').textContent = 'Error fetching data';
    }
}

async function viewHistoricalRates() {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;
    const date = '2023-01-01'; // Hardcoded for demonstration, you can make this user input

    if (!baseCurrency || !targetCurrency) {
        document.getElementById('historical-rates-container').textContent = 'Invalid input';
        return;
    }

    try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?date=${date}&base_currency=${baseCurrency}`, {
            headers: {
                'apikey': apiKey
            }
        });
        const data = await response.json();
        const rate = data.data[targetCurrency];
        document.getElementById('historical-rates-container').textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    } catch (error) {
        console.error('Error fetching historical exchange rate:', error);
        document.getElementById('historical-rates-container').textContent = 'Error fetching data';
    }
}

function saveFavoritePair() {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;
    if (!baseCurrency || !targetCurrency) {
        return;
    }
    const favoritePair = `${baseCurrency}/${targetCurrency}`;
    const favoritePairsContainer = document.getElementById('favorite-currency-pairs');
    const button = document.createElement('button');
    button.textContent = favoritePair;
    button.addEventListener('click', () => {
        document.getElementById('base-currency').value = baseCurrency;
        document.getElementById('target-currency').value = targetCurrency;
        convertCurrency();
    });
    favoritePairsContainer.appendChild(button);
}
