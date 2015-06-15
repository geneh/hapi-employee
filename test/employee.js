var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Request = require('request');
var lab = exports.lab = Lab.script();
var server = exports.server = require('../index');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

describe('Employee APIs:', function () {

    it('List all employees - database down', function (done) {

        var options = {
            method: 'GET',
            url: '/employee'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(500);
            done();
        });
    });

    it('List all employees', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ rows: [{ doc: { id: 1, name: 'Joe' } }] }));
        });

        var options = {
            method: 'GET',
            url: '/employee'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employees = response.result;
            expect(employees).to.be.instanceof(Array);
            expect(employees[0].id).to.equal(1);
            expect(employees[0].id).to.equal(1);
            expect(employees[0].name).to.equal('Joe');
            done();
        });
    });

    it('List all employees - DB returns no rows', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ error: 'Some error' }));
        });

        var options = {
            method: 'GET',
            url: '/employee'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employees = response.result;
            expect(employees).to.be.instanceof(Array);
            expect(employees).to.have.length(0);
            done();
        });
    });

    it('List all employees - incorrect query param', function (done) {

        var options = {
            method: 'GET',
            url: '/employee?test=1'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('List all employees - incorrect value of sort query param', function (done) {

        var options = {
            method: 'GET',
            url: '/employee?sort=abc'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('List all employees - asc value of sort query param', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ rows: [{ doc: { id: 1, name: 'Joe' } }] }));
        });

        var options = {
            method: 'GET',
            url: '/employee?sort=asc'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employees = response.result;
            expect(employees).to.be.instanceof(Array);
            expect(employees).to.have.length(1);
            expect(employees[0].id).to.equal(1);
            expect(employees[0].name).to.equal('Joe');
            done();
        });
    });

    it('List all employees - desc value of sort query param', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ rows: [{ doc: { id: 1, name: 'Joe' } }] }));
        });

        var options = {
            method: 'GET',
            url: '/employee?sort=desc'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employees = response.result;
            expect(employees).to.be.instanceof(Array);
            expect(employees).to.have.length(1);
            expect(employees[0].id).to.equal(1);
            expect(employees[0].name).to.equal('Joe');
            done();
        });
    });

    it('Get employee - database down', function (done) {

        var options = {
            method: 'GET',
            url: '/employee/5'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(500);
            done();
        });
    });

    it('Get employee', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 1, name: 'Joe', rev: '1234567' }));
        });

        var options = {
            method: 'GET',
            url: '/employee/5'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee.id).to.equal(1);
            expect(employee.name).to.equal('Joe');
            expect(employee.rev).to.be.null;
            done();
        });
    });

    it('Get employee - DB returns no object', function (done) {

        var stub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ error: 'not_found', reason: 'missing' }));
        });

        var options = {
            method: 'GET',
            url: '/employee/5'
        };

        server.inject(options, function (response) {

            stub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee).to.be.empty();
            done();
        });
    });

    it('Update employee - database down', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { id: 7, name: 'Dave' }
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(500);
            done();
        });
    });

    it('Update existing employee using POST', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var putStub = Sinon.stub(Request, 'put', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            putStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee.id).to.equal(7);
            expect(employee.name).to.equal('Joe');
            expect(employee.rev).to.be.null;
            done();
        });
    });

    it('Update non-existing employee using POST', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ error: 'not_found', reason: 'missing' }));
        });

        var putStub = Sinon.stub(Request, 'put', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            putStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee.id).to.equal(7);
            expect(employee.name).to.equal('Joe');
            expect(employee.rev).to.be.null;
            done();
        });
    });

    it('Update existing employee using PUT', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var putStub = Sinon.stub(Request, 'put', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var options = {
            method: 'PUT',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            putStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee.id).to.equal(7);
            expect(employee.name).to.equal('Joe');
            expect(employee.rev).to.be.null;
            done();
        });
    });

    it('Update non-existing employee using PUT', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ error: 'not_found', reason: 'missing' }));
        });

        var putStub = Sinon.stub(Request, 'put', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var options = {
            method: 'PUT',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            putStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee.id).to.equal(7);
            expect(employee.name).to.equal('Joe');
            expect(employee.rev).to.be.null;
            done();
        });
    });

    it('Update employee - incorrect path parameter value', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/abc',
            payload: { id: 7, name: 'Dave' }
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('Update employee - missing payload', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/4'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('Update employee - incorrect payload id value', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { id: 'abc', name: 'Dave' }
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('Update employee - incorrect payload name value', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { id: 7, name: 'Dave!' }
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('Update employee - incorrect payload names', function (done) {

        var options = {
            method: 'POST',
            url: '/employee/7',
            payload: { idx: 7, names: 'Dave' }
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(400);
            done();
        });
    });

    it('Delete employee - database down', function (done) {

        var options = {
            method: 'DELETE',
            url: '/employee/7'
        };

        server.inject(options, function (response) {

            expect(response.statusCode).to.equal(500);
            done();
        });
    });

    it('Delete existing employee', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ id: 7, name: 'Joe', rev: '1234567' }));
        });

        var delStub = Sinon.stub(Request, 'del', function (url, callback) {

            callback(null, null, null);
        });

        var options = {
            method: 'DELETE',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            delStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee).to.be.empty();
            done();
        });
    });

    it('Delete non-existing employee', function (done) {

        var getStub = Sinon.stub(Request, 'get', function (url, callback) {

            callback(null, null, JSON.stringify({ error: 'not_found', reason: 'missing' }));
        });

        var delStub = Sinon.stub(Request, 'del', function (url, callback) {

            callback(null, null, null);
        });

        var options = {
            method: 'DELETE',
            url: '/employee/7',
            payload: { id: 7, name: 'Joe' }
        };

        server.inject(options, function (response) {

            getStub.restore();
            delStub.restore();
            expect(response.statusCode).to.equal(200);
            var employee = response.result;
            expect(employee).to.be.instanceof(Object);
            expect(employee).to.be.empty();
            done();
        });
    });
});
