'use strict';

//mixin underscore.string into lodash
_.mixin(_.str.exports());

var app = angular.module('websyncApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'socket-io',
    'ui.bootstrap',
    'luegg.directives'
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

}).run(function (socket) {

    socket.on('connecting', function () {
        console.log('Socket.IO connecting to server...');
    });

    socket.on('connect', function () {
        console.log('Socket.IO connected to server!');
    });

    socket.on('error', function (err) {
        console.log(err);
    });

    alertify.set({
        delay: 3000
    });

});