/**
 * Created by furier on 18/04/14.
 */

module.exports = function (app) {

    var server = require('http').createServer(app);
    var io = require('socket.io')(server);

    return {
        io: io,
        server: server
    };
};