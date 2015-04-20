/**
 * Created by sander.struijk on 08.08.14.
 */
'use strict';

var Rsync = require('rsync'),
    _ = require('lodash');

var rmd = require('./rsyncmetadata.js'),
    hostManager = require('./hostmanager.js');

function _buildRsyncObject(sourceHost, destinationHost, path, flags) {
    console.log('Building rsync object for path.id: ' + path.id);

    function _combineHostAndPath(host, path) {
        return host.username + '@' + host.host + ':' + path;
    }

    var rsync = new Rsync()
        .flags(flags)
        .source(sourceHost ? _combineHostAndPath(sourceHost, path.source) : path.source)
        .destination(destinationHost ? _combineHostAndPath(destinationHost, path.destination) : path.destination)
        .progress();

    if (destinationHost && destinationHost.port) {
        rsync.shell('ssh -p ' + destinationHost.port);
    } else if (sourceHost && sourceHost.port) {
        rsync.shell('ssh -p ' + sourceHost.port);
    } else
        rsync.shell('ssh');

    return rsync;
}

module.exports = {
    buildRsyncObjects: function (task) {
        var sourceHost = hostManager.findHost(task.source.host);
        var destinationHost = hostManager.findHost(task.destination.host);
        var rsyncTasks = [];
        _.forEach(task.paths, function (path) {
            if (!(path.source === '' || path.destination === ''))
                rsyncTasks.push(_buildRsyncObject(sourceHost, destinationHost, path, task.flags));
        });
        return rsyncTasks;
    },
    executeRsyncTask: function (rsync, id, io) {
        console.log('Executing rsync object for task.id: ' + id);

        function _splitStringOnNewLine(data) {
            return _.filter(data.toString().split('\n'), function (line) {
                return line !== '';
            });
        }

        return rsync.execute(
            function (error, code, cmd) {
                var errorCodeMessage = rmd.getErrorCode(code);
                var errorMessage = error ? error.toString() : error;
                io.emit('task.finished.' + id, {
                    error: errorMessage,
                    errorCode: {
                        code: code,
                        message: errorCodeMessage
                    },
                    cmd: cmd
                });
            }, function (data) {
                var lines = _splitStringOnNewLine(data);
                lines.forEach(function (line) {
                    io.emit('task.progress.' + id, line);
                });
            }, function (data) {
                var lines = _splitStringOnNewLine(data);
                lines.forEach(function (line) {
                    io.emit('task.error.' + id, line);
                });
            }
        );
    }
};
