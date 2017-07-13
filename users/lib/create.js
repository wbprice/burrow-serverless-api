'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDbClient = require('./dynamoDbClient');

/**
 * @name
 * create
 * @description
 * Accepts an HTTP POST request with body JSON containing keys 
 * 'name' and 'emailAddress' and creates a record in the Users table.
 * @param {object} event 
 * @param {object} context 
 * @param {function} callback 
 */

function create(event, context, callback) {
    // Only accept JSON.
    if (event.headers["Content-Type"] !== 'application/json') {
        return callback(new Error('Wrong content type'));
    }
    
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: data.name,
            emailAddress: data.emailAddress,
            password: data.password,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    dynamoDbClient.put(params, (error) => {
        // handle errors
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t create the user'));
            return;
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        });
    });
}

module.exports = create;
