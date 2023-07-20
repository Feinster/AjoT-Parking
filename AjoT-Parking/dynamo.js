const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
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

/*
//getCharacters();

const addOrUpdateCharacter = async(character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character
    }

    return await dynamoClient.put(params).promise();
}

const hp = {
    "id": "0",
    "username": "matteo@hotmail.it",
    "password": "123stella"
};

const getCharactersById = async(id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        }
    }
    return await dynamoClient.get(params).promise();
}

const deleteCharacter = async(id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        }
    };
    return await dynamoClient.delete(params).promise();
}
*/
//addOrUpdateCharacter(hp);