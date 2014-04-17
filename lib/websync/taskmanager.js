/**
 * Created by furier on 16/04/14.
 */
'use strict';

var _ = require('lodash'),
    jf = require('jsonfile'),
    Rsync = require('rsync'),
    file = __dirname + '/../../tasks.json';

module.exports = function (io) {

    var tasks = [];

    io.sockets.on('connection', function (socket) {
        console.log('Socket.IO has connected to client!');
    });

    function readTasksFromFile() {

        jf.readFile(file, function (err, obj) {
            if (err) {
                console.log(err);
                return;
            }
            tasks = obj.tasks;
            console.log('Tasks (' + tasks.length + ') read as JSON from file: ' + file);
        });

    }

    function saveTasksToFile() {

        jf.writeFile(file, {tasks: tasks}, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Tasks (' + tasks.length + ') saved as JSON to file: ' + file);
        });

    }

    function findTask(id) {

        var task = _.find(tasks, function (t) {
            return t.id === id;
        });

        if (task) {
            console.log('Found task.id: ' + id);
            return task;
        }

        console.log('Could not find task.id: ' + id);

    }

    function replaceTask(oldTask, newTask) {

        var indexOfTask2Replace = tasks.indexOf(oldTask);
        tasks.splice(indexOfTask2Replace, 1, newTask);
        console.log('Replaced old task with new task.');

    }

    function removeTask(id) {

        var task = _.remove(tasks, function (t) {
            return t.id === id;
        });

        if (task && _.some(task)) {
            console.log('Removed task.id: ' + id);
            return _.first(task);
        }

    }

    function saveTask(task) {

        var exist = findTask(task.id);

        if (exist) {

            replaceTask(exist, task);
            saveTasksToFile();
            console.log('Updated task.id: ' + task.id);

        } else {

            tasks.push(task);
            saveTasksToFile();
            console.log('Added task.id: ' + task.id);
            return task;

        }
    }

    function buildRsyncObject(task) {
        console.log('Building rsync object for task.id: ' + task.id);
        return new Rsync()
            .shell(task.shell)
            .flags(task.flags)
            .source(task.source)
            .destination(task.destination);
    }

    function runTask(id) {
        var task = findTask(id);
        if (task) {
            var rsync = buildRsyncObject(task);
            rsync.execute(
                function(error, code, cmd) {
                    console.log('Rsync task.id: ' + id + ' has finished execution.');
                    io.sockets.emit('task.finished.' + id);
                }, function(data){
                    console.log('progress: ' + data);
                    console.log(data.)
                    io.sockets.emit('task.progress.' + id, data);
                }, function(data) {
                    console.log('error: ' + data);
                    io.sockets.emit('task.error.' + id, data);
                }
            );
        }
    }

    (function init() {
        readTasksFromFile();
        console.log('Initialized task manager.');
    })();

    return {
        tasks: function () {
            return tasks;
        },
        findTask: findTask,
        replaceTask: replaceTask,
        removeTask: removeTask,
        saveTask: saveTask,
        runTask: runTask
    };
};