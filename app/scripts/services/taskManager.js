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

        return task;
    });

    var tasks = Restangular.all('tasks').getList().$object;

    var newTask = function () {
        var task = {
            id: guid(),
            name: '',
            source: '',
            destination: '',
            flags: [],
            shell: '',
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

    return {
        newTask: newTask,
        removeTask: removeTask,
        saveTask: saveTask,
        tasks: tasks
    }
});