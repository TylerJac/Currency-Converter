const apiKey = 'fca_live_7WvBofwghMKkVBQZsxFgblwDs6e4EqYuHiZig1fX'; // API key for authentication
const apiURL = 'https://api.freecurrencyapi.com/v1/latest'; // Base URL for the currency API

// Add event listeners after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies(); // Fetch available currencies and populate dropdowns
    document.getElementById('amount').addEventListener('input', convertCurrency); // Trigger conversion on amount input change
    document.getElementById('base-currency').addEventListener('change', convertCurrency); // Trigger conversion on base currency change
    document.getElementById('target-currency').addEventListener('change', convertCurrency); // Trigger conversion on target currency change
    document.getElementById('historical-rates').addEventListener('click', viewHistoricalRates); // View historical rates on button click
    document.getElementById('save-favorite').addEventListener('click', saveFavoritePair); // Save favorite currency pair on button click
});

// Fetch available currencies and populate dropdowns
async function fetchCurrencies() {
    try {
        const response = await fetch(apiURL, {
            headers: {
                'apikey': apiKey // Include API key in the request header
            }
        });
        const data = await response.json();
        populateCurrencyDropdowns(Object.keys(data.data)); // Populate dropdowns with currency keys
    } catch (error) {
        console.error('Error fetching currencies:', error); // Log any errors
    }
}

// Populate currency dropdowns with fetched currencies
function populateCurrencyDropdowns(currencies) {
    const baseSelect = document.getElementById('base-currency'); // Base currency dropdown
    const targetSelect = document.getElementById('target-currency'); // Target currency dropdown
    currencies.forEach(currency => {
        const option = document.createElement('option'); // Create option element
        option.value = currency; // Set option value
        option.textContent = currency; // Set option text
        baseSelect.appendChild(option); // Add option to base currency dropdown
        targetSelect.appendChild(option.cloneNode(true)); // Add cloned option to target currency dropdown
    });
}

// Convert currency and update the UI with the converted amount
async function convertCurrency() {
    const baseCurrency = document.getElementById('base-currency').value; // Get selected base currency
    const targetCurrency = document.getElementById('target-currency').value; // Get selected target currency
    const amount = parseFloat(document.getElementById('amount').value); // Get entered amount and convert to float
    if (!baseCurrency || !targetCurrency || isNaN(amount) || amount <= 0) {
        document.getElementById('converted-amount').textContent = 'Invalid input'; // Display invalid input message
        return;
    }

    try {
        const response = await fetch(`${apiURL}?base_currency=${baseCurrency}`, {
            headers: {
                'apikey': apiKey // Include API key in the request header
            }
        });
        const data = await response.json();
        const rate = data.data[targetCurrency]; // Get exchange rate for target currency
        const convertedAmount = (amount * rate).toFixed(2); // Calculate converted amount and format to 2 decimal places
        document.getElementById('converted-amount').textContent = `${convertedAmount} ${targetCurrency}`; // Display converted amount
    } catch (error) {
        console.error('Error fetching exchange rate:', error); // Log any errors
        document.getElementById('converted-amount').textContent = 'Error fetching data'; // Display error message
    }
}

// View historical rates for a specific currency on a specific date
async function viewHistoricalRates() {
    const baseCurrency = document.getElementById('base-currency').value; // Get selected base currency
    const targetCurrency = document.getElementById('target-currency').value; // Get selected target currency
    const date = '2023-01-01'; // Hardcoded date for historical rates
    if (!baseCurrency || !targetCurrency) {
        document.getElementById('historical-rates-container').textContent = 'Invalid input'; // Display invalid input message
        return;
    }

    try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?date=${date}&base_currency=${baseCurrency}`, {
            headers: {
                'apikey': apiKey // Include API key in the request header
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Throw error if response is not OK
        }

        const data = await response.json();
        console.log('Historical data:', data); // Log the response to see its structure

        // Assuming the API response structure is { data: { [date]: { [currency]: rate } } }
        const rate = data.data?.[date]?.[targetCurrency]; // Get historical exchange rate
        if (rate) {
            document.getElementById('historical-rates-container').textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`; // Display historical rate
        } else {
            document.getElementById('historical-rates-container').textContent = 'Rate not available for the selected date and currency.'; // Display rate not available message
        }
    } catch (error) {
        console.error('Error fetching historical exchange rate:', error); // Log any errors
        document.getElementById('historical-rates-container').textContent = 'Error fetching data'; // Display error message
    }
}

// Save favorite currency pair and add it to the list of favorite pairs
function saveFavoritePair() {
    const baseCurrency = document.getElementById('base-currency').value; // Get selected base currency
    const targetCurrency = document.getElementById('target-currency').value; // Get selected target currency
    if (!baseCurrency || !targetCurrency) {
        return; // Return if either currency is not selected
    }
    const favoritePair = `${baseCurrency}/${targetCurrency}`; // Create favorite pair string
    const favoritePairsContainer = document.getElementById('favorite-currency-pairs'); // Get favorite pairs container
    const button = document.createElement('button'); // Create button element
    button.textContent = favoritePair; // Set button text
    button.addEventListener('click', () => {
        document.getElementById('base-currency').value = baseCurrency; // Set base currency to saved pair
        document.getElementById('target-currency').value = targetCurrency; // Set target currency to saved pair
        convertCurrency(); // Trigger conversion for saved pair
    });
    favoritePairsContainer.appendChild(button); // Add button to favorite pairs container
}
