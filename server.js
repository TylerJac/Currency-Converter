import express from 'express'; // Import the Express library
import { Sequelize, DataTypes } from 'sequelize'; // Import Sequelize and DataTypes from the Sequelize library

const app = express(); // Create an instance of the Express application
const sequelize = new Sequelize('sqlite:./database.sqlite'); // Initialize Sequelize with SQLite for persistence, using a file-based database

// Define a Sequelize model for the FavoritePair table
const FavoritePair = sequelize.define('FavoritePair', {
    baseCurrency: {
        type: DataTypes.STRING, // Define the baseCurrency field as a string
        allowNull: false // Make the field non-nullable
    },
    targetCurrency: {
        type: DataTypes.STRING, // Define the targetCurrency field as a string
        allowNull: false // Make the field non-nullable
    }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));
// Parse incoming JSON requests
app.use(express.json());

// Define a route to handle POST requests for adding favorite currency pairs
app.post('/favorites', async (req, res) => {
    try {
        const { baseCurrency, targetCurrency } = req.body; // Destructure baseCurrency and targetCurrency from the request body
        const favoritePair = await FavoritePair.create({ baseCurrency, targetCurrency }); // Create a new FavoritePair in the database
        res.json(favoritePair); // Send the created favorite pair as JSON response
    } catch (error) {
        console.error('Error saving favorite pair:', error); // Log any errors
        res.status(500).json({ error: 'Unable to save favorite pair' }); // Send a 500 status code with an error message
    }
});

// Define a route to handle GET requests for fetching all favorite currency pairs
app.get('/favorites', async (req, res) => {
    try {
        const favoritePairs = await FavoritePair.findAll(); // Fetch all favorite pairs from the database
        res.json(favoritePairs); // Send the fetched favorite pairs as JSON response
    } catch (error) {
        console.error('Error fetching favorite pairs:', error); // Log any errors
        res.status(500).json({ error: 'Unable to fetch favorite pairs' }); // Send a 500 status code with an error message
    }
});

// Synchronize the Sequelize models with the database and start the server
sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:5500'); // Log a message when the server is running
    });
});
