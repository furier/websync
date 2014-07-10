/**
 * Created by furier on 16/04/14.
 */
'use strict';

var path = require('path');

var jf = require('jsonfile'),
    _ = require('lodash'),
    Rsync = require('rsync');

var rmd = require('./rsyncmetadata.js'),
    hostManager = require('./hostmanager.js'),
    file = path.normalize(__dirname + '/../../tasks.json');

var tasks = [];

function _readTasksFromFile() {
    tasks = jf.readFileSync(file).tasks;
    console.log('Tasks (' + tasks.length + ') read as JSON from file: ' + file);
}

function _saveTasksToFile() {
    jf.writeFile(file, {tasks: tasks}, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Tasks (' + tasks.length + ') saved as JSON to file: ' + file);
    });
}

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

_readTasksFromFile();
console.log('Initialized task manager.');

var taskManager = module.exports = function (io) {

    io.sockets.on('connection', function () {
        console.log('Socket.IO has connected to client!');
    });

    return {
        tasks: tasks,
        findTask: function(id) {
            var task = _.find(tasks, function (t) {
                return t.id === id;
            });
            if (task) {
                console.log('Found task.id: ' + id);
                return task;
            }
            console.log('Could not find task.id: ' + id);
        },
        replaceTask: function(oldTask, newTask) {
            var indexOfTask2Replace = tasks.indexOf(oldTask);
            tasks.splice(indexOfTask2Replace, 1, newTask);
            console.log('Replaced old task with new task.');
        },
        removeTask: function(id) {
            var task = _.remove(tasks, function (t) {
                return t.id === id;
            });
            if (task && _.some(task)) {
                console.log('Removed task.id: ' + id);
                _saveTasksToFile();
                return _.first(task);
            }
        },
        saveTask: function(task) {
            _removeBlankPaths(task.paths);
            var exist = this.findTask(task.id);
            if (exist) {
                this.replaceTask(exist, task);
                _saveTasksToFile();
                console.log('Updated task.id: ' + task.id);
            } else {
                tasks.push(task);
                _saveTasksToFile();
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