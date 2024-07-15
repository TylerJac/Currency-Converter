import express from 'express';

// Set up your express server and Sequelize ORM here.
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const FavoritePair = sequelize.define('FavoritePair', {
    baseCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

app.use(express.static('public'));
app.use(express.json());

app.post('/favorites', async (req, res) => {
    const { baseCurrency, targetCurrency } = req.body;
    const favoritePair = await FavoritePair.create({ baseCurrency, targetCurrency });
    res.json(favoritePair);
});

app.get('/favorites', async (req, res) => {
    const favoritePairs = await FavoritePair.findAll();
    res.json(favoritePairs);
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
