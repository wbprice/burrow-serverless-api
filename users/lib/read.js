'use strict';

const dynamoDbClient = require('./dynamoDbClient');

function list(callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE
    }

    dynamoDbClient.scan(params, (error, result) => {
        if (error) {
            console.log(error);
            return callback(new Error('Couldn\'t fetch records'))
        }

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        });
    });
}

function readOne(id, callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        }
    }

    dynamoDbClient.get(params, (error, result) => {
        if (error) {
            console.log(error);
            return callback(new Error('Could\'t fetch that record.'));
        }
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        });
    });
}

/**
 * @name
 * read
 * @description
 *  
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */

function read(event, context, callback) {
    const id = event.pathParameters && event.pathParameters.id;

    if (id) {
        return readOne(id, callback);
    }
    return list(callback);
}

module.exports = read;
