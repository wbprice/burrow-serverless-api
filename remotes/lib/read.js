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

    // it is known that my id is this...
    const userId = 'us-east-1:9d37a391-4af4-410d-9151-34000ef42f61'

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
}

module.exports = list;
