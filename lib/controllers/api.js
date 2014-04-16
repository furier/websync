'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    file = __dirname + '/../../tasks.json';

var tasks = [];

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    tasks = JSON.parse(data).tasks;
});

function saveTasksToFile() {
    fs.writeFile(file, JSON.stringify({tasks: tasks}, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('JSON saved to ' + file);
        }
    });
}

exports.getTasks = function (req, res) {
    res.json(tasks);
    console.log('Returning tasks! (' + tasks.length + ')');
};

exports.postTask = function (req, res) {
    var task = _.find(tasks, function (t) {
        return t.id === req.body.id;
    });
    if (task) {
        tasks.splice(tasks.indexOf(task), 1, req.body);
        console.log('Updated task.id: ' + task.id);
    } else {
        task = req.body;
        tasks.push(task);
        res.json(task);
        console.log('Added task.id: ' + task.id);
    }
    saveTasksToFile();
};

exports.deleteTask = function (req, res) {
    var id = req.params.id;
    var removed = _.remove(tasks, function (t) {
        return t.id === id;
    });
    if (removed && _.some(removed)) {
        saveTasksToFile();
        console.log('Removed task.id: ' + id);
    }
    else
        console.log('No task found to delete with the id: ' + id);
};
