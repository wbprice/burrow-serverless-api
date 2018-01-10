'use strict';

const AWS = require('aws-sdk');

const { 
    USER_POOL_ID, 
    CLIENT_ID, 
    IDENTITY_POOL_ID,
    AWS_REGION
} = process.env;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}

function list(event, context, callback) {
    const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', ''); 

    if (!token) {
        return callback(null, {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                message: 'This endpoint requires a bearer token'
            })
        })
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
            return callback(null, {
                statusCode: error.statusCode,
                headers,
                body: JSON.stringify(error)
            });      
        } 

        const userId = AWS.config.credentials.identityId;
        const dbClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            ExpressionAttributeValues: {
                ':userId': userId
            },
            KeyConditionExpression: `user_id = :userId`
        }

        return dbClient.query(params, (error, result) => {
            if (error) {
                console.log('query', error);
                return callback(null, {
                    statusCode: error.statusCode,
                    headers,
                    body: JSON.stringify(error)
                });
            }

            return callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify(result.Items)
            });
        });
    });
}

module.exports = list;
