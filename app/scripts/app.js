'use strict';

var app = angular.module('websyncApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'socket-io'
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
