/**
 * Created by furier on 29/03/14.
 */
'use strict';

app.factory('taskManager', function (toolkit, Restangular) {

    var guid = toolkit.guid;
    var tasks = Restangular.all('tasks').getList().$object;

    Restangular.extendModel('tasks', function (task) {

        if (!task.id) task.id = guid();

        task.first = true;

        task.hasFlag = function (flag) {
            var found = false;
            task.flags.forEach(function (value) {
                if (flag.short === value) {
                    found = true;
                }
            });
            return found;
        };
        task.toggleFlag = function (flag) {
            if (task.hasFlag(flag)) {
                // Remove flag
                var index = task.flags.indexOf(flag.short);
                if (index > -1) {
                    task.flags.splice(index, 1);
                }
            }
            else {
                // Add flag
                task.flags.push(flag.short);
            }
        };
        task.run = function () {
            console.debug('run task: ' + task.id);
            Restangular.one('runtask', task.id).post();
        };
        task.test = function () {
            console.debug('test task: ' + task.id);
            Restangular.one('testtask', task.id).post();
        };
        task.addPath = function () {
            console.debug('adding path for task: ' + task.id);
            throw new Error('Not yet implemented exception.');
        };
        task.removePath = function (path) {
            console.debug('removing path for task: ' + task.id);
            var index = task.paths.indexOf(path);
            task.paths.splice(index, 1);
            saveTask(task);
        };
        task.save = function () {
            saveTask(task);
        };
        task.saveDelayed = function (n, o) {
            if (n === o) return;
            if (task.first) {
                task.first = false;
                return;
            }
            toolkit.delayAction('task', function () {
                saveTask(task);
            }, 500);
        };
        task.delete = function () {
            removeTask(task);
        };
        return task;
    });

    var saveTask = function (task) {
        console.debug('Saving task: ' + task.id);
        return task.put();
    };

    var removeTask = function (task) {
        console.debug('Removing task: ' + task.id);
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
        return task.remove();
    };

    return {
        tasks: tasks,
        saveTask: saveTask,
        removeTask: removeTask,
        newTask: function () {
            var task = {
                id: guid(),
                name: '',
                source: {
                    name: 'Source',
                    connectionType: 'default',
                    connectionTypes: [
                        'default',
                        'ssh'
                    ],
                    host: '',
                    username: ''
                },
                destination: {
                    name: 'Destination',
                    connectionType: 'default',
                    connectionTypes: [
                        'default',
                        'ssh'
                    ],
                    host: '',
                    username: ''
                },
                paths: [],
                flags: [],
                first: true
            };
            return tasks.post(task).then(function (task) {
                console.debug('Adding task:id ' + task.id);
                tasks.push(task);
            });
        }
    };
});