'use strict';

const { 
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} = require('amazon-cognito-identity-js');

const getUserAttributes = require('./util/getUserAttributes');
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

    return cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
            const token = result.getAccessToken().getJwtToken();
            
            return getUserAttributes(cognitoUser, (err, attributes) => {
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(
                        Object.assign(
                            {}, 
                            attributes,
                            {token}
                        )
                    )
                })
            }); 
        },
        onFailure(err) {
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
    })

    return getAttributes(cognitoUser, authenticationDetails, callback);
}

module.exports = login;
