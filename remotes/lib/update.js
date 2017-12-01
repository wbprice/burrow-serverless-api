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
 * update 
 * @description
 * 
 **/

function update(event, context, callback) {
    const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', '');
    const id = event.pathParameters.id;

    if (!id) {
        return callback(new Error('An ID is required to update a record.'));
    }

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

        const data = event.body && JSON.parse(event.body);

        if (!Object.keys(data).length) {
            return callback(new Error('Data is required to update.'));
        }

        const userId = AWS.config.credentials.identityId;
        const dbClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                user_id: userId, 
                id: id
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#temperature': 'temperature',
                '#updatedAt': 'updatedAt'
            },
            ExpressionAttributeValues: {
                ':name': data.name,
                ':temperature': data.temperature,
                ':updatedAt': new Date().getTime()
            },
            UpdateExpression: 'SET #name = :name,' +
                                  '#temperature = :temperature,' +
                                  '#updatedAt = :updatedAt',
            ReturnValues: 'ALL_NEW',
        };

        return dbClient.update(params, (err, data) => {
            if (err) {
                return callback(err);
            }
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(data.Attributes)
            });
        });
    });
}

module.exports = update;
