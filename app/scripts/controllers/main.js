'use strict';

module.exports = function ($scope, taskManager, rsyncMetaData, hostManager) {

    $scope.flags = rsyncMetaData.flags;
    $scope.tasks = taskManager.tasks;
    $scope.newTask = taskManager.newTask;
    $scope.removeTask = taskManager.removeTask;
    $scope.hosts = hostManager.hosts;

};
