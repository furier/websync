/**
 * Created by furier on 18/04/14.
 */

module.exports = function (app) {

    var server = require('http').createServer(app);
    var io = require('socket.io').listen(server);

    io.configure('production', function () {
        io.enable('browser client minification');  // send minified client
        io.enable('browser client etag');          // apply etag caching logic based on version number
        io.enable('browser client gzip');          // gzip the file
        io.set('log level', 1);                    // reduce logging

        // enable all transports (optional if you want flashsocket support, please note that some hosting
        // providers do not allow you to create servers that listen on a port different than 80 or their
        // default port)
        io.set('transports', [
            'websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling'
        ]);
    });

    io.configure('development', function () {
        io.set('transports', ['websocket']);
    });

    return {
        io: io,
        server: server
    };
};