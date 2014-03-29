/**
 * Created by furier on 29/03/14.
 */
'use strict';

angular.module('websyncApp')

    .factory('rsyncMetaData', function () {

        function Flag(name, short, tooltip) {
            return {
                name: name,
                short: short,
                tooltip: tooltip
            };
        }

        return {
            flags: [
                new Flag('archive', 'a', 'archive mode'),
                new Flag('verbose', 'v', 'increase verbosity'),
                new Flag('compress', 'z', 'compress file data during the transfer')
            ],
            shells: ['ssh', 'bash', 'powershell']
        }
    });