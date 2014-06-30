'use strict';
var _ = require('lodash');

module.exports = function(io){

    var tm = require('../websync/taskmanager')(io);
    var rmd = require('../websync/rsyncmetadata');
    var ndt = require('../node-directory-tree');

    //read
    function getTasks(req, res) {
        res.json(tm.tasks());
        console.log('Returning tasks! (' + tm.tasks().length + ')');
    }

    //create & update
    function postTask(req, res) {
        var task = tm.saveTask(req.body);
        if (task) {
            res.json(task);
        }
        res.send('OK', 200);
    }

    //delete
    function deleteTask(req, res) {
        tm.removeTask(req.params.id);
        res.send('OK', 200);
    }

    //run task
    function runTask(req, res) {
        tm.runTask(req.params.id);
        res.send('OK', 200);
    }

    //test task
    function testTask(req, res) {
        tm.testTask(req.params.id);
        res.send('OK', 200);
    }

    //get rsync flags
    function getFlags(req, res) {
        res.json(rmd.flags());
    }

    //get directory structure for path
    function getDirectoryStructure(req, res) {
        var childrenOfDir = ndt.directoryTreeSync(_.isString(req.body.path) ? req.body.path : req.body.path.toString(), [], false).children;
        var childrenOfDirSortedByType = _.sortBy(childrenOfDir, 'type');
        res.json(childrenOfDirSortedByType);
    }

    return {
        getTasks: getTasks,
        postTask: postTask,
        deleteTask: deleteTask,
        runTask: runTask,
        testTask: testTask,
        getFlags: getFlags,
        getDirectoryStructure: getDirectoryStructure
    };
};
