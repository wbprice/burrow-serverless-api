'use strict'

/**
 * @module users 
 * @description
 * Exposes REST actions for dealing with user records.
 */

module.exports = {
  login: require('./lib/login'),
  logout: require('./lib/logout'),
  signup: require('./lib/signup'),
  confirmAccount: require('./lib/confirm-account'),
  getUserInfo: require('./lib/get-user-info')
}
