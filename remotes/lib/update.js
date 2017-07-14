'use strict';

const dbClient = require('./dbClient');

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

    dbClient.update(params, (err, data) => {
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
