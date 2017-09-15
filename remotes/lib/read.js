'use strict';

const dbClient = require('./dbClient');

function list(callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE
    }

    dbClient.scan(params, (error, result) => {
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

    dbClient.get(params, (error, result) => {
        if (error) {
            return callback([]);
        }
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        });
    });
}

function searchByOwner(owner, callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: 'owner = :owner',
        ExpressionAttributeValues: {
            ':owner': owner
        }
    }

    dbClient.scan(params, (error, result) => {
        if (error) { 
            console.log(error);
            return callback('Couldn\'t find that record');
        }
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Items)
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
    const owner = event.queryStringParameters && event.queryStringParameters.owner;

    if (id) {
        return readOne(id, callback);
    } else if (owner) {
        return searchByOwner(owner, callback);
    }
    return list(callback);
}

module.exports = read;
