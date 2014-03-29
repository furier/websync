/**
 * Created by furier on 29/03/14.
 */
'use strict';

angular.module('websyncApp')

    .factory('taskManager', function (toolkit) {

        var guid = toolkit.guid;

        function Task(name, source, destination, flags, shell, id){

            var task = {
                id: id || guid(),
                name: name,
                source: source,
                destination: destination,
                flags: flags || [],
                shell: shell
            };

            var hasFlag = function (flag){
                var found = false;
                task.flags.forEach(function(value){
                    if(flag.short === value) {
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
            task.hasFlag = hasFlag;

            return  task;
        }

        var tasks = [
            new Task('Task1', '/home/username', 'username@another.server.com:/backup', ['a', 'v', 'z'], 'ssh'),
            new Task('Task2', '/usr/local/bin/fantasy', 'username@another.server.com', ['n'], 'bash'),
            new Task('Task3', '/var/logs', 'username@another.server.com', ['a'], 'powershell')
        ];

        var newTask = function(){
            tasks.push(new Task());
        };

        var removeTask = function(task){
            var index = tasks.indexOf(task);
            tasks.splice(index, 1);
        };

        return {
            newTask: newTask,
            removeTask: removeTask,
            tasks: tasks
        }
    });