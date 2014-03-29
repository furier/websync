'use strict';

angular.module('websyncApp')

    .controller('MainCtrl', function ($scope, taskManager, rsyncMetaData) {

        $scope.flags = rsyncMetaData.flags;
        $scope.shells = rsyncMetaData.shells;
        $scope.tasks = taskManager.tasks;

        $.each(taskManager.tasks, function(index, task){

        });

    });
