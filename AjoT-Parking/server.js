const express = require('express');
const {
    getSensorValues,
    getSensorValuesByIdAndMacAndTime
} = require('./dynamo');
var mysql = require('mysql');
const cors = require('cors');
const {
    last,
    first
} = require('rxjs');
require('dotenv').config();

const app = express();
app.use(cors());

var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';

    connection.query(query, (error, results) => {
        console.log(results);
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/user', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/userRegistration', (req, res) => {
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const email = req.query.email;
    const password = req.query.password;
    const query = `INSERT INTO users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${password}')`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/parking', (req, res) => {
    const query = 'SELECT p.*, COUNT(s.id) AS occupiedStalls FROM parking AS p LEFT JOIN stalls AS s ON p.MAC = s.MAC_PARKING GROUP BY p.MAC';

    connection.query(query, (error, results) => {
        console.log(results);
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/parkingInsertion', (req, res) => {
    const MAC = req.query.MAC;
    const city = req.query.city;
    const address = req.query.address;
    const location = req.query.location;
    const nStalls = req.query.nStalls;
    const isOpen = req.query.isOpen;
    const img = req.query.img;

    const query = `INSERT INTO parking (MAC, city, address, location, nStalls, isOpen, img) VALUES ('${MAC}', '${city}', '${address}', '${location}' , '${nStalls}', '${isOpen}', '${img}')`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/stalls', (req, res) => {
    const MAC = req.query.MAC;
    const query = `SELECT * FROM stalls WHERE MAC_PARKING = '${MAC}'`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/parkingByMAC', (req, res) => {
    const MAC = req.query.MAC;
    const query = `SELECT p.*, COUNT(s.id) AS occupiedStalls FROM parking AS p LEFT JOIN stalls AS s ON p.MAC = s.MAC_PARKING WHERE MAC = '${MAC}' GROUP BY p.MAC`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/stallInsertion', (req, res) => {
    const id = req.query.id;
    const GPIO = req.query.GPIO;
    const MAC_PARKING = req.query.MAC_PARKING;
    const isFree = req.query.isFree;

    const query = `INSERT INTO stalls (id, GPIO, MAC_PARKING, isFree) VALUES ('${id}', '${GPIO}', '${MAC_PARKING}' , ${isFree})`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/changeStatusParking', (req, res) => {
    const MAC = req.query.MAC;
    const newStatus = req.query.newStatus

    const query = `UPDATE parking SET isOpen = ${newStatus} WHERE MAC = '${MAC}'`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/deleteStall', (req, res) => {
    const MAC = req.query.MAC;
    const id = req.query.id

    const query = `DELETE FROM stalls WHERE (id = '${id}') and (MAC_PARKING = '${MAC}')`;

    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
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

const port = 3000; // The port on which Node.js will run

app.listen(port, () => {
    console.log(`Node.js server listening on port ${port}`);
});

//connection.end();