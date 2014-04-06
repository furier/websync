/**
 * Created by furier on 29/03/14.
 */
'use strict';

app.factory('taskManager', function (toolkit, Restangular) {

    var guid = toolkit.guid;

    function Task(name, source, destination, flags, shell, id) {

        var task = {
            id: id || guid(),
            name: name,
            source: source,
            destination: destination,
            flags: flags || [],
            shell: shell,
            first: true
        };

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

        };

        return  task;
    }

    var tasks = [];
    var all = Restangular.all('tasks');
    var list = all.getList();
    var $object = list.$object;
    $object.forEach(function(task){
        console.log(task);
        tasks.push(new Task(task.name, task.source, task.destination, task.flags, task.shell, task.id));
    });

    var newTask = function () {
        tasks.push(new Task());
    };

    var removeTask = function (task) {
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
    };

    var saveTask = function (task) {
        if (task.first) {
            task.first = false;
            return;
        }
    };

    return {
        newTask: newTask,
        removeTask: removeTask,
        saveTask: saveTask,
        tasks: tasks
    }
});