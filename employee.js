var Joi = require('joi');
var Request = require('request');
var Boom = require('boom');
var Config = require('./config');

var employee = {
    register: function (server, options, next) {

        server.route({
            method: 'GET',
            path: '/employee',
            config: {
                tags: ['api'],
                validate: {
                    query: {
                        sort: Joi.string().equal('asc').equal('desc')
                    }
                }
            },

            handler: function (request, reply) {

                var param = '';
                if (request.query.sort === 'desc') {
                    param = '&descending=true';
                }
                Request.get(Config.dbUrl + '/_all_docs?include_docs=true' + param, function (err, response, body) {

                    if (err) {
                        var error = Boom.wrap(err);
                        console.error(error);
                        reply(error);
                    } else {
                        var docBody = JSON.parse(body);
                        var employees = [];
                        if (docBody.rows) {
                            for (var i = 0, il = docBody.rows.length; i < il; ++i) {
                                var employee = docBody.rows[i];
                                employees.push({ id: employee.doc.id, name: employee.doc.name });
                            }
                        }
                        reply(employees);
                    }
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/employee/{id}',
            config: {
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.number().integer().min(1).required()
                    }
                }
            },
            handler: function (request, reply) {

                Request.get(Config.dbUrl + encodeURIComponent(request.params.id), function (err, response, body) {

                    if (err) {
                        var error = Boom.wrap(err);
                        console.error(error);
                        reply(error);
                    } else {
                        var docBody = JSON.parse(body);
                        if (docBody.id) { //Document exists
                            delete docBody._id;
                            delete docBody._rev;
                            reply(docBody);
                        } else {
                            reply({});
                        }
                    }
                });
            }
        });

        server.route({
            method: ['POST', 'PUT'],
            path: '/employee/{id}',
            config: {
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.number().integer().min(1).required()
                    },
                    payload: {
                        id: Joi.number().integer().min(1).required(),
                        name: Joi.string().alphanum().required()
                    }
                }
            },
            handler: function (request, reply) {

                // console.log('Adding or updating employee', encodeURIComponent(request.params.id));
                // console.log('Payload:', request.payload);
                Request.get(Config.dbUrl + encodeURIComponent(request.params.id), function (err, response, body) {

                    if (err) {
                        var error = Boom.wrap(err);
                        console.error(error);
                        reply(error);
                    } else {
                        var docBody = JSON.parse(body);
                        if (docBody.id) { //Document exists, provide latest revision to update.
                            request.payload._rev = docBody._rev;
                        }
                        Request.put({
                            url: Config.dbUrl + encodeURIComponent(request.params.id),
                            json: request.payload
                        }, function (error, response, body) {

                            delete request.payload._rev;
                            reply(request.payload);
                        });
                    }
                });
            }
        });

        server.route({
            method: 'DELETE',
            path: '/employee/{id}',
            config: {
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.number().integer().min(1).required()
                    }
                }
            },
            handler: function (request, reply) {

                Request.get(Config.dbUrl + encodeURIComponent(request.params.id), function (err, response, body) {

                    if (err) {
                        var error = Boom.wrap(err);
                        console.error(error);
                        reply(error);
                    } else {
                        var docBody = JSON.parse(body);
                        if (docBody.id) { //Document exists
                            var url = Config.dbUrl + encodeURIComponent(request.params.id) + '?rev=' + docBody._rev;
                            Request.del(url, function (error, response, body) {
                            });
                        }
                        reply({});
                    }
                });
            }
        });

        next();
    }
};

employee.register.attributes = {
    name: 'employee',
    version: '1.0.0'
};

module.exports = employee;
