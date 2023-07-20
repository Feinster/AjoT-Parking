const awsIot = require('aws-iot-device-sdk');
var AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.region = process.env.AWS_DEFAULT_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID
});

var iotdata = new AWS.IotData({
    endpoint: process.env.HOST
});

const getThingShadow = async(MAC) => {
    var params = {
        thingName: MAC,
    };
    iotdata.getThingShadow(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
}

const updateThingShadow = async(MAC, body) => {
    var params = {
        payload: body,
        thingName: MAC,
    };
    iotdata.updateThingShadow(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
}

const subscribeStatus = async(MAC) => {

    const thingName = MAC;
    var shadowsRegistered = false;
    var cognitoIdentity = new AWS.CognitoIdentity();

    AWS.config.credentials.get(function(err, data) {
        if (!err) {
            console.log('retrieved identity from Cognito: ' + AWS.config.credentials.identityId);
            var params = {
                IdentityId: AWS.config.credentials.identityId
            };

            cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
                if (!err) {

                    // Create the AWS IoT shadows object.
                    const thingShadows = awsIot.thingShadow({
                        region: AWS.config.region,
                        host: process.env.HOST,
                        clientId: thingName,
                        // Connect via secure WebSocket
                        protocol: 'wss',
                        // Set the maximum reconnect time to 8 seconds; this is a browser application
                        // so we don't want to leave the user waiting too long for re-connection after
                        // re-connecting to the network/re-opening their laptop/etc...
                        maximumReconnectTimeMs: 8000,
                        // Set Access Key, Secret Key and session token based on credentials from Cognito
                        accessKeyId: data.Credentials.AccessKeyId,
                        secretKey: data.Credentials.SecretKey,
                        sessionToken: data.Credentials.SessionToken
                    });

                    thingShadows.on('status', function(thingName, statusType, clientToken, stateObject) {
                        console.log('status event received for my own operation', statusType)
                        if (statusType === 'rejected') {
                            if (stateObject.code !== 404) {
                                console.log('re-sync with thing shadow');
                                var opClientToken = thingShadows.get(thingName);
                                if (opClientToken === null) {
                                    console.log('operation in progress');
                                }
                            }
                        } else {
                            var newStatus = 0;
                            var id = 2;
                            changeStatusStallOnDB(MAC, newStatus, id);
                        }
                    });

                    thingShadows.on('foreignStateChange', function(thingName, operation, stateObject) {
                        console.log(stateObject.state.desired.welcome);
                        console.log('foreignStateChange event received', stateObject)

                        if (operation === "update") {
                            var newStatus = 0;
                            var id = 2;
                            changeStatusStallOnDB(MAC, newStatus, id);
                        }
                    });

                    thingShadows.on('connect', function() {
                        console.log('connect event received');

                        // We only register the shadow once.
                        if (!shadowsRegistered) {
                            thingShadows.register(thingName, {}, function(err, failedTopics) {

                                // If there are no errors
                                if (!err) {
                                    console.log(thingName + ' has been registered');

                                    // Fetch the initial state of the Shadow
                                    var opClientToken = thingShadows.get(thingName);
                                    if (opClientToken === null) {
                                        console.log('operation in progress');
                                    }
                                    shadowsRegistered = true;
                                }
                            });
                        }
                    });


                } else {
                    console.log('Error retrieving credentials: ' + err);
                    alert('Error retrieving credentials: ' + err);
                }
            });
        } else {
            console.log('Error retrieving identity:' + err);
            alert('Error retrieving identity: ' + err);
        }
    });
}

const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});

const connectedClients = new Set();

server.on('connection', (ws) => {
    console.log('Client connected');
    connectedClients.add(ws);

    // send hello world to client just for test
    const dataToSend = {
        message: 'Hello from server!'
    };
    ws.send(JSON.stringify(dataToSend));

    // Receive messages from client
    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    // Close the connection when the client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
        connectedClients.delete(ws); // Remove the disconnected client from the list
    });
});

// Function to send a message to all connected clients
function broadcastMessage(message) {
    connectedClients.forEach((client) => {
        client.send(message);
    });
}

function changeStatusStallOnDB(MAC, newStatus, id) {
    console.log("*********************changeStatusStallOnDB")
    const url = 'http://localhost:3000/api/changeStatusStall';

    const requestBody = {
        MAC: MAC,
        newStatus: newStatus,
        id: id
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    fetch(url, fetchOptions)
        .then(response => response.json())
        .then(data => {
            broadcastMessage('update_status');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

module.exports = {
    getThingShadow,
    updateThingShadow,
    subscribeStatus,
};