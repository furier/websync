'use strict';

app.controller('MainCtrl', function ($scope, taskManager, rsyncMetaData) {

    $scope.flags = rsyncMetaData.flags;
    $scope.shells = rsyncMetaData.shells;
    $scope.tasks = taskManager.tasks;
    $scope.newTask = taskManager.newTask;
    $scope.removeTask = taskManager.removeTask;

});
