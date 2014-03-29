/**
 * Created by furier on 29/03/14.
 */
'use strict';

angular.module('websyncApp')

    .factory('taskManager', function () {

        function Task(id, name, source, destination, flags, shell){

            var task = {
                id: id,
                name: name,
                source: source,
                destination: destination,
                flags: flags,
                shell: shell
            };

            function toggleFlag(flag){
                $.each(task.flags, function(index, value){
                    if(flag.short === value) {
                        task.flags.splice(index, 1);
                        return;
                    }
                });
                task.flags.push(flag.short);
            }

            function hasFlag(flag){
                $.each(task.flags, function(index, value){
                    if(flag.short === value)
                        return true;
                });
                return false;
            }

            task.toggleFlag = toggleFlag;
            task.hasFlag = hasFlag;

            return  task;
        }

        return {
            tasks: [
                new Task(1, 'Task1', '/home/username', 'username@another.server.com:/backup', ['a', 'v', 'z'], 'ssh'),
                new Task(2, 'Task2', '/usr/local/bin/fantasy', 'username@another.server.com', ['n'], 'bash'),
                new Task(3, 'Task3', '/var/logs', 'username@another.server.com', ['a'], 'powershell')
            ]
        }
    });