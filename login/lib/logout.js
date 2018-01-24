'use strict'

const AWS = require('aws-sdk')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

function logout (event, context, callback) {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()
  const token = event.headers.Authorization && event.headers.Authorization.replace('Bearer ', '')

  if (!token) {
    return callback(null, {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        message: 'This endpoint requires a bearer token'
      })
    })
  }

  return cognitoIdentityServiceProvider.globalSignOut({AccessToken: token}, (error, data) => {
    if (error) {
      return callback(error, {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: error.errorMessage
        })
      })
    }

    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'user signed out'
      })
    })
  })
}

module.exports = logout
