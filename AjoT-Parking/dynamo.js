// Import the 'aws-sdk' library, which provides access to various AWS services
const AWS = require('aws-sdk');

// Load environment variables from a .env file
require('dotenv').config();

// Configure AWS SDK with the necessary credentials and region
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create a new instance of DynamoDB DocumentClient
const dynamoClient = new AWS.DynamoDB.DocumentClient();
// Define a constant variable 'TABLE_NAME' with the name of the DynamoDB table
const TABLE_NAME = "AjoT_sensorValues"

const getSensorValues = async() => {
    const params = {
        TableName: TABLE_NAME
    };
    const characters = await dynamoClient.scan(params).promise();
    return characters;
}

const getSensorValuesByIdAndMacAndTime = async(id, MAC, time) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'stall_id = :stall_id AND MAC_address = :MAC_address AND time_microseconds > :today',
        ExpressionAttributeValues: {
            ":stall_id": parseInt(id),
            ":MAC_address": MAC,
            ":today": parseInt(time)
        },
    }
    return await dynamoClient.scan(params).promise();
}

module.exports = {
    dynamoClient,
    getSensorValues,
    getSensorValuesByIdAndMacAndTime
}