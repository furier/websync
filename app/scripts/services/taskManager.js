/**
 * Created by furier on 29/03/14.
 */
'use strict';

app.factory('taskManager', function (toolkit, Restangular) {

    var guid = toolkit.guid;

    Restangular.extendModel('tasks', function(task){

        if(!task.id) task.id = guid();

        task.first = true;

        var hasFlag = function (flag) {
            var found = false;
            task.flags.forEach(function (value) {
                if (flag.short === value) {
                    found = true;
                }
            });
            return found;
        };
        task.hasFlag = hasFlag;

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

        task.test = function(){
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

        return task;
    });

    var tasks = Restangular.all('tasks').getList().$object;

    var newTask = function () {
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
        console.debug('Adding task:id ' + task.id);
        tasks.post(task).then(function(task){
            tasks.push(task);
        });
    };

    var removeTask = function (task) {
        console.debug('Removing task: ' + task.id);
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
        task.remove();
    };

    var saveTask = function (task) {
        console.debug('Saving task: ' + task.id);
        task.put();
    };

    var timeout = null;
    var saveTaskWatch = function (newVal, oldVal, task) {
        if (newVal !== oldVal) {
            if (task.first) {
                task.first = false;
                return;
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                saveTask(task);
            }, 500);
        }
    };

    return {
        newTask: newTask,
        removeTask: removeTask,
        saveTask: saveTask,
        saveTaskWatch: saveTaskWatch,
        tasks: tasks
    };
});