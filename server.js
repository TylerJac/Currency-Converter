import express from 'express';

const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Favorite = sequelize.define('Favorite', {
    base: { type: DataTypes.STRING, allowNull: false },
    target: { type: DataTypes.STRING, allowNull: false }
});

app.use(express.json());
app.use(express.static('public'));

app.post('/favorites', async (req, res) => {
    const { base, target } = req.body;
    const favorite = await Favorite.create({ base, target });
    res.json(favorite);
});

app.get('/favorites', async (req, res) => {
    const favorites = await Favorite.findAll();
    res.json(favorites);
});

sequelize.sync().then(() => app.listen(3000, () => console.log('Server running on port 3000')));
