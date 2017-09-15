'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dbClient = require('./dbClient');

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
            ownedBy: data && data.ownedBy || 'unowned',
            name: data && data.name || 'Remote',
            temperature: data && data.temperature || 72,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    dbClient.put(params, (error) => {
        // handle errors
        if (error) {
            callback(error);
            return;
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        });
    });
}

module.exports = create;
