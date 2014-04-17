'use strict';
var tm = require('../websync/taskmanager');

//read
exports.getTasks = function (req, res) {
    res.json(tm.tasks());
    console.log('Returning tasks! (' + tm.tasks().length + ')');
};

//create & update
exports.postTask = function (req, res) {
    var task = tm.saveTask(req.body);
    if (task) res.json(task);
};

//delete
exports.deleteTask = function (req, res) {
    tm.removeTask(req.params.id);
};

//run task
exports.runTask = function(req, res) {
    tm.runTask(req.params.id);
};
