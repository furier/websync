'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('path.getChildren', function (pathString, callback) {

            fs.readdir(pathString, function (err, files) {
                if (err)
                    socket.emit('path.getChildren.error', err);
                else {
                    console.log(files);
                }
            });

        });
    });
};

