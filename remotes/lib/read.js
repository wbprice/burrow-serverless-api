'use strict';

const AWS = require('aws-sdk');

const { 
    USER_POOL_ID, 
    CLIENT_ID, 
    IDENTITY_POOL_ID,
    AWS_REGION
} = process.env;

function list(event, context, callback) {
    const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', ''); 

    if (!token) {
        return callback(null, {
            statusCode: 403,
            body: JSON.stringify('A bearer token is required to access this resource')
        });
    }

    AWS.config.region = AWS_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : IDENTITY_POOL_ID,
        Logins : {
            [`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] : token
        }
    });

    console.log(AWS.config.credentials);

    AWS.config.credentials.refresh(() => {
        const dbClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.DYNAMODB_TABLE
        }

        return dbClient.scan(params, (error, result) => {
            if (error) {
                return callback(error, {
                    statusCode: 400,
                    body: JSON.stringify(error)
                });
            }

            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(result.Items)
            });
        });
    });
}

module.exports = list;
