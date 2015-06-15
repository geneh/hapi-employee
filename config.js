var config = {};

// $lab:coverage:off$
config.dbUrl = 'http://' + (process.argv[2] || '0.0.0.0') + ':5984/employee/';

// $lab:coverage:on$

module.exports = config;
