document.getElementById('convert-button').addEventListener('click', async () => {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;
    const amount = document.getElementById('amount').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        const rate = await getExchangeRate(baseCurrency, targetCurrency);
        const convertedAmount = amount * rate;
        document.getElementById('result').textContent = `${amount} ${baseCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}`;
    } catch (error) {
        alert('Error fetching exchange rate: ' + error.message);
    }
});

document.getElementById('historical-button').addEventListener('click', async () => {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;
    const date = '2021-01-01';  // or use an input for user to select date

    try {
        const response = await fetch(`https://api.exchangeratesapi.io/${date}?base=${baseCurrency}`);
        const data = await response.json();
        const historicalRate = data.rates[targetCurrency];
        document.getElementById('historical-rate').textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
    } catch (error) {
        alert('Error fetching historical rate: ' + error.message);
    }
});

document.getElementById('save-favorite-button').addEventListener('click', async () => {
    const baseCurrency = document.getElementById('base-currency').value;
    const targetCurrency = document.getElementById('target-currency').value;

    try {
        await fetch('/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base: baseCurrency, target: targetCurrency })
        });

        loadFavorites();
    } catch (error) {
        alert('Error saving favorite: ' + error.message);
    }
});

async function loadFavorites() {
    try {
        const response = await fetch('/favorites');
        const favorites = await response.json();

        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';

        favorites.forEach(favorite => {
            const listItem = document.createElement('li');
            listItem.textContent = `${favorite.base}/${favorite.target}`;
            listItem.addEventListener('click', () => {
                document.getElementById('base-currency').value = favorite.base;
                document.getElementById('target-currency').value = favorite.target;
            });
            favoritesList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error loading favorites: ' + error.message);
    }
}

loadFavorites();

async function getExchangeRate(base, target) {
    const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${base}`);
    const data = await response.json();
    return data.rates[target];
}
