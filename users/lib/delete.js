'use strict';

const dbClient = require('./dbClient');

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

    if (!id) {
        return callback(new Error('An ID is required to delete a record'));
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        }
    }

    return dbClient.delete(params, (error, record) => {
        if (error) {
            return callback(error);
        }

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(record)
        })
    });
}

module.exports = del;
