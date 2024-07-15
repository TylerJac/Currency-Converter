import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const sequelize = new Sequelize('sqlite:./database.sqlite'); // Use file-based SQLite for persistence

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
    try {
        const { baseCurrency, targetCurrency } = req.body;
        const favoritePair = await FavoritePair.create({ baseCurrency, targetCurrency });
        res.json(favoritePair);
    } catch (error) {
        console.error('Error saving favorite pair:', error);
        res.status(500).json({ error: 'Unable to save favorite pair' });
    }
});

app.get('/favorites', async (req, res) => {
    try {
        const favoritePairs = await FavoritePair.findAll();
        res.json(favoritePairs);
    } catch (error) {
        console.error('Error fetching favorite pairs:', error);
        res.status(500).json({ error: 'Unable to fetch favorite pairs' });
    }
});

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
