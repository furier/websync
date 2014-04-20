'use strict';

module.exports = function(io){

    var tm = require('../websync/taskmanager')(io);

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

    return {
        getTasks: getTasks,
        postTask: postTask,
        deleteTask: deleteTask,
        runTask: runTask,
        testTask: testTask
    };
};
