'use strict';

/**
 * Get awesome things
 */
exports.tasks = function (req, res) {
    res.json([
        {
            name: 'Task1',
            source: "/some/source/to/copy",
            destination: "/some/destination/to/copy/too",
            flags: ['a', 'v'],
            shell: 'ssh'
        },
        {
            name: 'Task2',
            source: "/some/source/to/copy",
            destination: "/some/destination/to/copy/too",
            flags: ['a', 'v'],
            shell: 'ssh'
        },
        {
            name: 'Task3',
            source: "/some/source/to/copy",
            destination: "/some/destination/to/copy/too",
            flags: ['a', 'v'],
            shell: 'ssh'
        }
    ]);
};
