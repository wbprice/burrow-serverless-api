'use strict';

const dynamoDbClient = require('./dynamoDbClient');

/**
 * @name
 * update 
 * @description
 * 
 **/

function update(event, context, callback) {

    const id = event.pathParameters.id;

    if (!id) {
        callback(new Error('An ID is required to update a record.'));
        return;
    }

    const data = event.body && JSON.parse(event.body);

    if (!Object.keys(data).length) {
        callback(new Error('Data is required to update.'));
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: id
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#emailAddress': 'emailAddress',
            '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':emailAddress': data.emailAddress,
            ':updatedAt': new Date().getTime()
        },
        UpdateExpression: 'SET #name = :name,' +
                              '#emailAddress = :emailAddress,' +
                              '#updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    dynamoDbClient.update(params, (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(data.Attributes)
        });
    });
}

module.exports = update;