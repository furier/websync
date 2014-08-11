'use strict';

var index = require('./controllers');

/**
 * Application routes
 */
module.exports = function (app, io) {

    var api = require('./controllers/api')(io);

    // Server API Routes
    (function initTaskRoutes() {
        app.get('/api/tasks', api.getTasks);
        app.post('/api/tasks', api.postTask);
        app.put('/api/tasks/:id', api.postTask);
        app.delete('/api/tasks/:id', api.deleteTask);
        app.post('/api/runtask/:id', api.runTask);
        app.post('/api/testtask/:id', api.testTask);
    }());

    (function initHostRoutes() {
        app.get('/api/hosts', api.getHosts);
        app.post('/api/hosts', api.postHost);
        app.put('/api/hosts/:id', api.postHost);
        app.delete('/api/hosts/:id', api.deleteHost);
    }());

    (function initGeneralRoutes(){
        app.get('/api/flags', api.getFlags);
        app.post('/api/getDirectoryStructure', api.getDirectoryStructure);
    }());

    // All undefined api routes should return a 404
    app.get('/api/*', function (req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', index.index);
};
