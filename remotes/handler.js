'use strict';

/**
 * @module users 
 * @description
 * Exposes REST actions for dealing with user records.
 */

module.exports = {
    create: require('./lib/create'),
    read: require('./lib/read'),
    update: require('./lib/update'),
    delete: require('./lib/delete')
};
