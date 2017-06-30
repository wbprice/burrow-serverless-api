'use strict';

const dynamoDbClient = require('./dynamoDbClient');

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
    const id = event.pathParameters.id;
    console.log(event);

    if (!id) {
        callback(new Error('An ID is required to delete a record'));
        return;
    }

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

module.exports = read;