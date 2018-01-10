'use strict'

const AWS = require('aws-sdk')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

function userAttributesToObject (attrs) {
  return attrs.reduce((memo, value) => {
    console.log(value)
    memo[value.Name] = value.Value
    return memo
  }, {})
}

function getUserInfo (event, context, callback) {
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

  return cognitoIdentityServiceProvider.getUser({AccessToken: token}, (error, data) => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify(error)
      })
    }

    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(userAttributesToObject(data.UserAttributes))
    })
  })
}

module.exports = getUserInfo
