'use strict'

function getUserAttributes (cognitoUser, callback) {
  return cognitoUser.getUserAttributes((err, result) => {
    if (err) {
      callback(err)
    }

    const body = result.reduce((memo, item) => {
      memo[item.Name] = item.Value
      return memo
    }, {})

    return callback(null, body)
  })
}

module.exports = getUserAttributes
