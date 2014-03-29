/**
 * Created by furier on 29/03/14.
 */
'use strict';

angular.module('websyncApp')

    .factory('taskManager', function () {

        function Task(id, name, source, destination, flags, shell){
            return {
                id: id,
                name: name,
                source: source,
                destination: destination,
                flags: flags,
                shell: shell
            };
        }

        return {
            tasks: [
                new Task(1, 'Task1', '/home/username', 'username@another.server.com:/backup', ['a', 'v', 'z'], 'ssh'),
                new Task(2, 'Task2', '/usr/local/bin/fantasy', 'username@another.server.com', ['n'], 'bash'),
                new Task(3, 'Task3', '/var/logs', 'username@another.server.com', ['a'], 'powershell')
            ]
        }
    });