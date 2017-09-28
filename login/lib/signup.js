'use strict';

const { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser
} = require('amazon-cognito-identity-js');

const UserPoolId = process.env.USER_POOL_ID;
const ClientId = process.env.CLIENT_ID;
const headers = JSON.stringify({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
});

function signup(event, context, callback) {

    if (event.headers["Content-Type"] !== 'application/json') {
        return callback(new Error('Wrong content type'));
    }

    const data = JSON.parse(event.body);
    const userPool = new CognitoUserPool({
        UserPoolId,
        ClientId
    });
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'name',
            Value: data.name
        }),
        new CognitoUserAttribute({
            Name: 'email',
            Value: data.email
        })
    ];

    return userPool.signUp(data.emailAddress, data.password, attributeList, null, (err, result) => {
        if (err) {
            const response = {
                statusCode: 500,
                body: JSON.stringify(err)
            };
            return callback(null, response);
        } 

        const { user } = result

        return user.getSession((sessionError, session) => {
            if (sessionError) {
                callback(sessionError);
            }

            return user.getUserAttributes((error, attributes) => {
                if (error) {
                    return callback(error);
                }

                console.log(attributes);

                const response = {
                    statusCode: 200,
                    body: JSON.stringify(attributes)
                };

                return callback(null, response);
            });
        });
    });
}

module.exports = signup;

