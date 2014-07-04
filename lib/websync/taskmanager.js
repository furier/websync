/**
 * Created by furier on 16/04/14.
 */
'use strict';

var path = require('path');

var jf = require('jsonfile'),
    _ = require('lodash'),
    Rsync = require('rsync');

var rmd = require('./rsyncmetadata.js'),
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

function _splitStringOnNewLine(data) {
    return _.filter(data.toString().split('\n'), function (line) {
        return line !== '';
    });
}

function _executeRsyncTask(rsync, id, io) {
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

function _buildRsyncObject(task) {
    console.log('Building rsync object for task.id: ' + task.id);
    return new Rsync()
        .shell(task.shell)
        .flags(task.flags)
        .source(task.source)
        .destination(task.destination)
        .progress();
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
                var rsync = _buildRsyncObject(task);
                _executeRsyncTask(rsync, id, io);
            }
        },
        testTask: function(id) {
            var task = this.findTask(id);
            if (task) {
                var rsync = _buildRsyncObject(task).dry();
                _executeRsyncTask(rsync, id, io);
            }
        }
    };
};