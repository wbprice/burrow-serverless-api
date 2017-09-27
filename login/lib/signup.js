'use strict';

const { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser
} = require('amazon-cognito-identity-js');

const UserPoolId = process.env.USER_POOL_ID;
const ClientId = process.env.CLIENT_ID;

function signup(event, context, callback) {

    if (event.headers["Content-Type"] !== 'application/json') {
        return callback(new Error('Wrong content type'));
    }

    const userPool = CognitoUserPool({
        UserPoolId,
        ClientId
    })

    const attributeList = [
        CognitoUserAttribute({
            Name: 'name',
            Value: data.name
        }),
        CognitoUserAttribute({
            Name: 'email',
            Value: data.email'
        })
    ];

    return userPool.signup(data.emailAddress, data.password, attributeList, null, (err, result) => {
        if (err) {
            return callback(err);
        } 
        return callback(null, result.user);
    });
}

module.exports = signup;

