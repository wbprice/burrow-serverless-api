'use strict';

const dynamoDbClient = require('./dynamoDbClient');

/**
 * @name 
 * delete
 * @description
 * Deletes a given record from the Users table
 * @param {object} event
 * @param {object} context
 * @param {function} callback
 * @example 
 * DELETE /user/3bc7e1c0-5dd2-11e7-b0e1-752f73f6be7e
 */

function del(event, context, callback) {
    // An id is required to delete a record.
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

    dynamoDbClient.delete(params, (error, record) => {
        if (error) {
            callback(error);
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(record)
        })
    });
}

module.exports = del;