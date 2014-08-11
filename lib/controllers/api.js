'use strict';
var _ = require('lodash');

var hm = require('../websync/hostmanager'),
    rmd = require('../websync/rsyncmetadata'),
    ndt = require('../node-directory-tree');

module.exports = function(io){

    var tm = require('../websync/taskmanager')(io);

    return {
        getTasks: function(req, res) {
            var tasks = tm.tasks();
            res.json(tasks);
            console.log('Returning tasks! (' + tasks.length + ')');
        },
        postTask: function(req, res) {
            var task = tm.saveTask(req.body);
            if (task) {
                res.json(task);
            }
            res.send('OK', 200);
        },
        deleteTask: function(req, res) {
            tm.removeTask(req.params.id);
            res.send('OK', 200);
        },
        runTask: function(req, res) {
            tm.runTask(req.params.id);
            res.send('OK', 200);
        },
        testTask: function(req, res) {
            tm.testTask(req.params.id);
            res.send('OK', 200);
        },
        getFlags: function(req, res) {
            res.json(rmd.flags);
        },
        getDirectoryStructure: function(req, res) {
            var childrenOfDir = ndt.directoryTreeSync(_.isString(req.body.path) ? req.body.path : req.body.path.toString(), [], false).children;
            var childrenOfDirSortedByType = _.sortBy(childrenOfDir, 'type');
            res.json(childrenOfDirSortedByType);
        },
        getHosts: function(req, res) {
            var hosts = hm.hosts();
            res.json(hosts);
            console.log('Returning hosts! (' + hosts.length + ')');
        },
        postHost: function(req, res) {
            var host = hm.saveHost(req.body);
            if (host) {
                res.json(host);
            }
            res.send('OK', 200);
        },
        deleteHost: function(req, res) {
            hm.removeHost(req.params.id);
            res.send('OK', 200);
        }
    };
}
