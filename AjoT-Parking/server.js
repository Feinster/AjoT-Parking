// Import the 'express' library, which is a web application framework for Node.js
const express = require('express');
// Import the 'mysql' library to interact with MySQL databases
var mysql = require('mysql');
// Import the 'cors' library, which provides Cross-Origin Resource Sharing support
const cors = require('cors');

//Import functions from other local files
const {
    getSensorValues,
    getSensorValuesByIdAndMacAndTime
} = require('./dynamo');
const {
    getThingShadow,
    updateThingShadow,
    subscribeStatus
} = require('./awsIotUtils');

// Load environment variables from a .env file
require('dotenv').config();

// Create an Express application
const app = express();
// Enable CORS (Cross-Origin Resource Sharing) middleware to allow cross-origin requests
app.use(cors());
// Enable middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Create a MySQL database connection configuration object using environment variables
var mysqlConnection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
});

// Attempt to establish a connection to the MySQL database using the provided configuration
mysqlConnection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

app.get('/api/users', (req, res) => {
    try {
        const query = 'SELECT * FROM users';

        mysqlConnection.query(query, (error, results) => {
            console.log(results);
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/user', (req, res) => {
    try {
        const email = req.query.email;
        const password = req.query.password;
        const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/userRegistration', (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const query = `INSERT INTO users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${password}')`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/parking', (req, res) => {
    try {
        const query = 'SELECT p.*, COUNT(s.id) AS availableStalls FROM parking AS p LEFT JOIN stalls AS s ON p.MAC = s.MAC_PARKING AND s.isFree = 1 GROUP BY p.MAC;';

        mysqlConnection.query(query, (error, results) => {
            console.log(results);
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/parkingInsertion', (req, res) => {
    try {
        const MAC = req.body.MAC;
        const city = req.body.city;
        const address = req.body.address;
        const location = req.body.location;
        const nStalls = req.body.nStalls;
        const isOpen = req.body.isOpen;
        const img = req.body.img;

        const query = `INSERT INTO parking (MAC, city, address, location, nStalls, isOpen, img) VALUES ('${MAC}', '${city}', '${address}', '${location}', '${nStalls}', '${isOpen}', '${img}')`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/stalls', (req, res) => {
    try {
        const MAC = req.query.MAC;
        const query = `SELECT * FROM stalls WHERE MAC_PARKING = '${MAC}'`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/parkingByMAC', (req, res) => {
    try {
        const MAC = req.query.MAC;
        const query = `SELECT p.*, COUNT(s.id) AS availableStalls FROM parking AS p LEFT JOIN stalls AS s ON p.MAC = s.MAC_PARKING AND s.isFree = 1 WHERE MAC = '${MAC}' GROUP BY p.MAC`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/stallInsertion', (req, res) => {
    try {
        const id = req.body.id;
        const GPIO = req.body.GPIO;
        const MAC_PARKING = req.body.MAC_PARKING;
        const isFree = req.body.isFree;

        const query = `INSERT INTO stalls (id, GPIO, MAC_PARKING, isFree) VALUES ('${id}', '${GPIO}', '${MAC_PARKING}', ${isFree})`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/countNStalls', (req, res) => {
    try {
        const MAC = req.query.MAC;
        const query = `SELECT p.nStalls as maxStalls, COUNT(s.id) as stalls FROM parking AS p LEFT JOIN stalls AS s ON p.MAC = s.MAC_PARKING WHERE MAC = '${MAC}' GROUP BY p.MAC;`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/changeStatusParking', (req, res) => {
    try {
        const MAC = req.body.MAC;
        const newStatus = req.body.newStatus;

        const query = `UPDATE parking SET isOpen = ${newStatus} WHERE MAC = '${MAC}'`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/changeStatusStall', (req, res) => {
    try {
        const MAC = req.body.MAC;
        const newStatus = req.body.newStatus;
        const id = req.body.id;

        const query = `UPDATE stalls SET isFree = ${newStatus} WHERE MAC_PARKING = '${MAC}' AND id = '${id}'`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/changeNumberOfStalls', (req, res) => {
    try {
        const MAC = req.body.MAC;
        const newNStalls = req.body.newNStalls;

        const query = `UPDATE parking SET nStalls = ${newNStalls} WHERE MAC = '${MAC}'`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.post('/api/deleteStall', (req, res) => {
    try {
        const MAC = req.body.MAC;
        const id = req.body.id;

        const query = `DELETE FROM stalls WHERE (id = '${id}') and (MAC_PARKING = '${MAC}')`;

        mysqlConnection.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/sensorValues', async(req, res) => {
    try {
        const values = await getSensorValues();
        res.json(values);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/getSensorValuesByIdAndMacAndTime', async(req, res) => {
    try {
        const id = req.query.id
        const MAC = req.query.MAC;
        const time = req.query.time;
        const values = await getSensorValuesByIdAndMacAndTime(id, MAC, time);
        res.json(values);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});

app.get('/api/getThingShadow', (req, res) => {
    const MAC = req.query.MAC;

    getThingShadow(MAC)
        .then((data) => {
            return res.json(data);
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Error in GET request ' + error
            });
        });
});

app.get('/api/subscribeStatus', (req, res) => {
    const MAC = req.query.MAC;

    subscribeStatus(MAC)
        .then((data) => {
            return res.json(data);
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Error in GET request ' + error
            });
        });
});

app.post('/api/updateThingShadow', (req, res) => {
    const MAC = req.body.MAC;
    const body = req.body.body;

    if (!MAC || !body) {
        return res.status(400).json({
            error: 'MAC and body fields are required in the request body'
        });
    }

    updateThingShadow(MAC, body)
        .then((data) => {
            return res.json(data);
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Error in POST request ' + error
            });
        });
});

const port = 3000; // The port on which Node.js will run

// Start the Node.js server and make it listen on a specified port
app.listen(port, () => {
    console.log(`Node.js server listening on port ${port}`);
});

//mysqlConnection.end();