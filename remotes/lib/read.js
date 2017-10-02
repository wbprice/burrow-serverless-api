'use strict';

const AWS = require('aws-sdk');

const { 
        USER_POOL_ID, 
        CLIENT_ID, 
        IDENTIY_POOL_ID 
      } = process.env;

function readOne(id, callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        }
    }

    return dbClient.get(params, (error, result) => {
        if (error) {
            return callback(error);
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
        FilterExpression: 'ownedBy = :ownedBy',
        ExpressionAttributeNames: {
            ':ownedBy': owner
        }
    }

    return dbClient.scan(params, (error, result) => {
        if (error) { 
            return callback(error);
        }
        return callback(null, {
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

function list(event, context, callback) {
    const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', ''); 

    if (!token) {
        return callback(null, {
            statusCode: 403,
            body: JSON.stringify('A bearer token is required to access this resource');
        });
    }

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : IDENTIY_POOL_ID,
        Logins : {
            [`cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`] : token
        }
    });

    const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE
    }

    return dbClient.scan(params, (error, result) => {
        if (error) {
            return callback(error);
        }

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        });
    });
}

module.exports = list;
