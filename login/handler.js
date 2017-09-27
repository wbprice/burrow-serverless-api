'use strict';

/**
 * @module users 
 * @description
 * Exposes REST actions for dealing with user records.
 */

module.exports = {
    login: require('./lib/login'),
    signup: require('./lib/signup')
};
