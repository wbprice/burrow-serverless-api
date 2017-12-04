'use strict'

const AWS = require('aws-sdk')

function userAttributesToObject (attrs) {
  return attrs.reduce((memo, value) => {
    console.log(value)
    memo[value.Name] = value.Value
    return memo
  }, {})
}

function getUserInfo (event, context, callback) {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

  if (!event.headers.Authorization) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        message: 'This endpoint requires a bearer token'
      })
    })
  }

  const params = {
    AccessToken: event.headers.Authorization.replace('Bearer ', '')
  }

  return cognitoIdentityServiceProvider.getUser(params, (error, data) => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode,
        body: JSON.stringify(error)
      })
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(userAttributesToObject(data.UserAttributes))
    })
  })
}

module.exports = getUserInfo
