'use strict'

const {
  CognitoUserPool,
  CognitoUser
} = require('amazon-cognito-identity-js')

const UserPoolId = process.env.USER_POOL_ID
const ClientId = process.env.CLIENT_ID
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

function confirmAccount (event, context, callback) {
  const {
    username,
    confirmationCode
  } = JSON.parse(event.body)

  const userPool = new CognitoUserPool({
    UserPoolId,
    ClientId
  })

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })

  return cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
    if (err) {
      return callback(null, {
        statusCode: 400,
        headers,
        body: JSON.stringify(err)
      })
    }

    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    })
  })
}

module.exports = confirmAccount
