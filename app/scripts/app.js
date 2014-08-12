'use strict';

require('angular-cookies');
require('angular-sanitize');
require('angular-route');
require('socket.io-client');
require('angular-socket');
require('angular-alertify');
require('angu-poly');
require('lodash');
require('restangular');
require('scrollglue');

var app = angular.module('websyncApp', [
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'ngSocket',
    'ngAlertify',
    'restangular',
    'luegg.directives',
    'ui.bootstrap',
    'angupoly'
]).config(function ($routeProvider, $locationProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('/api');

    $routeProvider
        .when('/', {
            templateUrl: 'partials/main',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

});

app.factory('toolkit', ['$timeout', require('./toolkit')]);
app.factory('reactComponents', [require('./services/reactComponents')]);
app.factory('directoryService', ['Restangular', require('./services/directoryService')]);
app.factory('rsyncMetaData', ['Restangular', require('./services/rsyncMetaData')]);
app.factory('hostManager', ['toolkit', 'Restangular', require('./services/hostManager')]);
app.factory('taskManager', ['toolkit', 'Restangular', require('./services/taskManager')]);
app.factory('pathHelper', ['toolkit', require('./services/pathHelper')]);

app.directive('task', ['$socket', 'pathHelper', require('./directives/task/task')]);
app.directive('path', ['$modal', 'pathHelper', require('./directives/task/path')]);
app.directive('taskFooter', [require('./directives/task/taskFooter')]);
app.directive('taskHeader', [require('./directives/task/taskHeader')]);
app.directive('dirNavigator', ['directoryService', 'alertify', require('./directives/dirNavigator')]);
app.directive('host', ['$modal', '$socket', 'hostManager', 'toolkit', require('./directives/host')]);
app.directive('logPanel', ['reactComponents', require('./directives/logPanel')]);
app.directive('scheduler', [require('./directives/scheduler')]);

app.controller('MainCtrl', ['$scope', 'taskManager', 'rsyncMetaData', 'hostManager', require('./controllers/main')]);

app.run(function ($socket, alertify) {

    $socket.on('connect', function () {
        console.log('Socket.IO connected to server!');
    });

    $socket.on('error', function (err) {
        console.log(err);
    });

    alertify.set({
        delay: 3000
    });

});

module.exports = app;