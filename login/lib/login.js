'use strict';

const { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} = require('amazon-cognito-identity-js');

const UserPoolId = process.env.USER_POOL_ID;
const ClientId = process.env.CLIENT_ID;

function login(event, context, callback) {

    const {
        username,
        password
    } = JSON.parse(event.body);

    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });

    const userPool = new CognitoUserPool({
        UserPoolId,
        ClientId
    });

    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
            const token = result.getAccessToken().getJwtToken();

            return cognitoUser.getUserAttributes((err, result) => {

                if (err) {
                    callback(err);
                }
            
                const body = result.reduce((memo, item) => {
                    memo[item.Name] = item.Value;
                    return memo;
                }, {token})

                const response = {
                    statusCode: 200,
                    body: JSON.stringify(body)
                };

                return callback(null, response);
            });
        },
        onFailure(err) {
            const response = {
                statusCode: 500,
                body: JSON.stringify(err)
            };

            return callback(null, response);
        }
    });
}

module.exports = login;
