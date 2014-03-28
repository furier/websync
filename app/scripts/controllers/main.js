'use strict';

angular.module('websyncApp')
    .controller('MainCtrl', function ($scope) {

        function createFlag(name, short, tooltip) {
            return {
                name: name,
                short: short,
                tooltip: tooltip
            };
        }

        $scope.tasks = [
            {
                id: 1,
                name: 'Task1',
                source: '/home/username',
                destination: 'username@another.server.com:/backup',
                flags: ['a', 'v', 'z'],
                shell: 'ssh'
            },
            {
                id: 2,
                name: 'Task2',
                source: '/usr/local/bin/fantasy',
                destination: 'username@another.server.com',
                flags: ['n'],
                shell: 'bash'
            },
            {
                id: 3,
                name: 'Task3',
                source: '/var/logs',
                destination: 'username@another.server.com',
                flags: ['n'],
                shell: 'powershell'
            }
        ];

        $scope.metadata = {
            flags: [
                createFlag('archive', 'a', 'archive mode; equals -rlptgoD (no -H,-A,-X)'),
                createFlag('verbose', 'v', 'increase verbosity'),
                createFlag('compress', 'z', 'compress file data during the transfer'),
            ],
            shells: ['ssh', 'bash', 'powershell']
        };

    });
