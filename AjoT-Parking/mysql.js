const express = require('express');
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
    const query = 'SELECT * FROM parking';

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

const port = 3000; // The port on which Node.js will run

app.listen(port, () => {
    console.log(`Node.js server listening on port ${port}`);
});

//connection.end();