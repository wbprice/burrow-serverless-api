'use strict'

const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} = require('amazon-cognito-identity-js')

const UserPoolId = process.env.USER_POOL_ID
const ClientId = process.env.CLIENT_ID
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

function login (event, context, callback) {
  const {
    username,
    password
  } = JSON.parse(event.body)

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  })

  const userPool = new CognitoUserPool({
    UserPoolId,
    ClientId
  })

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })

  return cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess (tokens) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(tokens)
      })
    },
    onFailure (err) {
      return callback(null, {
        statusCode: 400,
        headers,
        body: JSON.stringify(err)
      })
    }
  })
}

module.exports = login
