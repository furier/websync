/**
 * Created by furier on 18/04/14.
 */

module.exports = function (app) {

    var server = require('http').createServer(app);
    var io = require('socket.io')(server);

    io.on('connection', function () {
        console.log('Socket.IO has connected to client!');
    });

    return {
        io: io,
        server: server
    };
};