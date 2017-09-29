'use strict';

const { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser
} = require('amazon-cognito-identity-js');

const UserPoolId = process.env.USER_POOL_ID;
const ClientId = process.env.CLIENT_ID;
const getUserAttributes = require('./util/getUserAttributes')

function confirmAccount(event, context, callback) {
    const {
        username,
        confirmationCode
    } = JSON.parse(event.body);

    console.log('event: ', event.body);

    const userPool = new CognitoUserPool({
        UserPoolId,
        ClientId
    });

    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });

    return cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
            return callback({
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };

        return callback(null, response);
    })
}

module.exports = confirmAccount;
