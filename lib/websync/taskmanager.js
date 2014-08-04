/**
 * Created by furier on 16/04/14.
 */
'use strict';

var _ = require('lodash'),
    Rsync = require('rsync');

var rmd = require('./rsyncmetadata.js'),
    hostManager = require('./hostmanager.js'),
    wsDAO = require('./wsdata-reader');;

function _executeRsyncTask(rsync, id, io) {

    function _splitStringOnNewLine(data) {
        return _.filter(data.toString().split('\n'), function (line) {
            return line !== '';
        });
    }

    rsync.execute(
        function (error, code, cmd) {
            var errorCodeMessage = rmd.getErrorCode(code);
            var errorMessage = error ? error.toString() : error;
            io.sockets.emit('task.finished.' + id, {
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
                io.sockets.emit('task.progress.' + id, line);
            });
        }, function (data) {
            var lines = _splitStringOnNewLine(data);
            lines.forEach(function (line) {
                io.sockets.emit('task.error.' + id, line);
            });
        }
    );
}

function _buildRsyncObjects(task) {
    var sourceHost = hostManager.findHost(task.source.host);
    var destinationHost = hostManager.findHost(task.destination.host);
    var rsyncTasks = [];
    _.forEach(task.paths, function (path) {
        if (!(path.source === '' || path.destination === ''))
            rsyncTasks.push(_buildRsyncObject(sourceHost, destinationHost, path, task.flags));
    });
    return rsyncTasks;
}

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

    if (sourceHost || destinationHost)
        rsync.shell(destinationHost.port
                    ? 'ssh -p ' + destinationHost.port
                    : sourceHost.port
                    ? 'ssh -p ' + sourceHost.port
                    : 'ssh');

    return rsync;
}

function _removeBlankPaths(paths) {
    _.remove(paths, function (path) {
        return !(path.source !== '' || path.destination !== '');
    });
}

var taskManager = module.exports = function (io) {

    io.sockets.on('connection', function () {
        console.log('Socket.IO has connected to client!');
    });

    return {
        tasks: function () {
            return wsDAO.tasks;
        },
        findTask: function(id) {
            var task = _.find(wsDAO.tasks, function (t) {
                return t.id === id;
            });
            if (task) {
                console.log('Found task.id: ' + id);
                return task;
            }
            console.log('Could not find task.id: ' + id);
        },
        replaceTask: function(oldTask, newTask) {
            var indexOfTask2Replace = wsDAO.tasks.indexOf(oldTask);
            wsDAO.tasks.splice(indexOfTask2Replace, 1, newTask);
            console.log('Replaced old task with new task.');
        },
        removeTask: function(id) {
            var task = _.remove(wsDAO.tasks, function (t) {
                return t.id === id;
            });
            if (task && _.some(task)) {
                console.log('Removed task.id: ' + id);
                wsDAO.saveDataToFile();
                return _.first(task);
            }
        },
        saveTask: function(task) {
            _removeBlankPaths(task.paths);
            var exist = this.findTask(task.id);
            if (exist) {
                this.replaceTask(exist, task);
                wsDAO.saveDataToFile();
                console.log('Updated task.id: ' + task.id);
            } else {
                wsDAO.tasks.push(task);
                wsDAO.saveDataToFile();
                console.log('Added task.id: ' + task.id);
                return task;
            }
        },
        runTask: function(id) {
            var task = this.findTask(id);
            if (task) {
                _.forEach(_buildRsyncObjects(task), function (rsync) {
                    _executeRsyncTask(rsync, id, io);
                });
            }
        },
        testTask: function(id) {
            var task = this.findTask(id);
            if (task) {
                _.forEach(_buildRsyncObjects(task), function (rsync) {
                    _executeRsyncTask(rsync.dry(), id, io);
                });
            }
        }
    };
};