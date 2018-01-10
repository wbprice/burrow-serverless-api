'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

const {
    USER_POOL_ID,
    CLIENT_ID,
    IDENTITY_POOL_ID,
    AWS_REGION
} = process.env;

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

    return AWS.config.credentials.get(error => {
        if (error) {
            return callback(error, {
                statusCode: 500,
                headers,
                body: JSON.stringify(error)
            });
        }

        const dbClient = new AWS.DynamoDB.DocumentClient();
        const userId = AWS.config.credentials.identityId;
        const data = JSON.parse(event.body);
        const timestamp = new Date().getTime();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: uuid.v1(),
                user_id: userId,
                name: data && data.name || 'Remote',
                temperature: data && data.temperature || 72,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };

        return dbClient.put(params, (error) => {
            if (error) {
                return callback(null, {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify(error)
                });
            }

            return callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify(params.Item)
            });
        });
    })
}

module.exports = create;
