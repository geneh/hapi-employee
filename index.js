var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ host: '0.0.0.0', port: 3000 });


server.register([
    { register: require('./employee') },
    {
        register: require('lout'),
        options: {
            endpoint: '/lout'
        }
    },
    { register: require('hapi-swagger') }], function (err) {
});


server.start(function () {

    console.log('Server running at:', server.info.uri);
});

module.exports = server;
