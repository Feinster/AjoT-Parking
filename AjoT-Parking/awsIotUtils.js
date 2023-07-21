// Import the AWS IoT SDK and AWS SDK
const awsIot = require('aws-iot-device-sdk');
var AWS = require('aws-sdk');

// Import the 'ws' library, which provides WebSocket functionality
const WebSocket = require('ws');

// Load environment variables from a .env file
require('dotenv').config();

// Set the AWS region using the environment variable
AWS.config.region = process.env.AWS_DEFAULT_REGION;
// Set up AWS credentials using Cognito Identity Pool
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID
});

// Create a new instance of the AWS IoT Data class with the provided endpoint
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

                    // Update whenever we receive status events from the shadows.
                    thingShadows.on('status', function(thingName, statusType, clientToken, stateObject) {
                        console.log('status event received for my own operation', statusType)
                        if (statusType === 'rejected') {
                            // If an operation is rejected it is likely due to a version conflict;
                            // request the latest version so that we synchronize with the shadow
                            // The most notable exception to this is if the thing shadow has not
                            // yet been created or has been deleted.
                            if (stateObject.code !== 404) {
                                console.log('re-sync with thing shadow');
                                var opClientToken = thingShadows.get(thingName);
                                if (opClientToken === null) {
                                    console.log('operation in progress');
                                }
                            }
                        } else { // statusType === 'accepted'
                            var newStatus = 0;
                            var id = 2;
                            changeStatusStallOnDB(MAC, newStatus, id);
                        }
                    });

                    // Update whenever we receive foreignStateChange events from the shadow.
                    // This is triggered when the truck Thing updates its state.
                    thingShadows.on('foreignStateChange', function(thingName, operation, stateObject) {
                        console.log(stateObject.state.desired.welcome);
                        console.log('foreignStateChange event received', stateObject)

                        if (operation === "update") {
                            var newStatus = 0;
                            var id = 2;
                            changeStatusStallOnDB(MAC, newStatus, id);
                        }
                    });

                    // Connect handler
                    // Register shadows on the first connect event
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

// Create a new WebSocket server instance on port 8080
const server = new WebSocket.Server({
    port: 8080
});

// Initialize an empty Set to store connected WebSocket clients
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
            //send a message to all clients to warn them that there has been a state change on the DB so they can reload the view
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