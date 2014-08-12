/**
 * Created by furier on 16/04/14.
 */
'use strict';

var _ = require('lodash');

var wsDAO = require('./wsdao'),
    rsyncRunner = require('./rsyncrunner'),
    cronManager = require('./cronmanager');

function _removeBlankPaths(paths) {
    _.remove(paths, function (path) {
        return !(path.source !== '' || path.destination !== '');
    });
}

var taskManager = module.exports = function (io) {

    wsDAO.e.on('ready', function () {
        cronManager.initialize(wsDAO.tasks, io);
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

            cronManager.deleteCronTask(oldTask.id);
            cronManager.createCronTask(newTask, io);

            console.log('Replaced old task with new task.');
        },
        removeTask: function(id) {
            var task = _.remove(wsDAO.tasks, function (t) {
                return t.id === id;
            });
            if (task && _.some(task)) {

                cronManager.deleteCronTask(id);

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

                cronManager.createCronTask(task, io);

                wsDAO.saveDataToFile();
                console.log('Added task.id: ' + task.id);
                return task;
            }
        },
        runTask: function(id) {
            var task = this.findTask(id);
            if (task) {
                _.forEach(rsyncRunner.buildRsyncObjects(task), function (rsync) {
                    rsyncRunner.executeRsyncTask(rsync, id, io);
                });
            }
        },
        testTask: function(id) {
            var task = this.findTask(id);
            if (task) {
                _.forEach(rsyncRunner.buildRsyncObjects(task), function (rsync) {
                    rsyncRunner.executeRsyncTask(rsync.dry(), id, io);
                });
            }
        }
    };
};