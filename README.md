# Currency Converter Application

## Overview

This is a currency converter application built using JavaScript for the frontend and Node.js with Express and Sequelize for the backend. The application fetches real-time currency exchange rates and allows users to convert between different currencies. Users can also view historical exchange rates and save their favorite currency pairs.

## Features

- Convert currencies in real-time.
- View historical exchange rates for specific dates.
- Save and manage favorite currency pairs.
- Persistent storage of favorite pairs using SQLite.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: Sequelize with SQLite
- API: [FreeCurrencyAPI](https://freecurrencyapi.com/)

## How to Run

### Step 1: Build the Docker Image
-Navigate to the project directory and run the following command to build the Docker image:

```
docker build -t currency-converter-app .
```
### Step 2: Run the Docker Container
- Once the image is built, run the following command to start the container:

```
docker run -p 3000:3000 currency-converter-app
```
### Step 3: Access the Application
- The application will be available at:

```
http://localhost:3000
```
