'use strict';

const AWS = require('aws-sdk');

const { 
    USER_POOL_ID, 
    CLIENT_ID, 
    IDENTITY_POOL_ID,
    AWS_REGION
} = process.env;

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

    const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', ''); 

    if (!token) {
        return callback(null, {
            statusCode: 403,
            body: JSON.stringify(new Error('A bearer token is required to access this resource'))
        });
    }

    AWS.config.region = AWS_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : IDENTITY_POOL_ID,
        Logins : {
            [`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] : token
        }
    });

    return AWS.config.credentials.get((error) => {
        if (error) {
            return callback(error, {
                statusCode: 400,
                body: JSON.stringify(error)
            });      
        } 

        const userId = AWS.config.credentials.identityId;
        console.log('userId', userId);
        console.log('id', id);
        const dbClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                user_id: userId, 
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
            });
        });
    });
}

module.exports = del;
