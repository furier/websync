/**
 * Created by furier on 06/04/14.
 */
'use strict';

app.controller('TaskCtrl', function ($scope, taskManager) {

    var timeout = null;
    var task = $scope.task;

    var save = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                taskManager.saveTask(task);
            }, 5000);
        }
    };

    $scope.$watch('task.name', save);
    $scope.$watch('task.source', save);
    $scope.$watch('task.destination', save);
    $scope.$watch('task.shell', save);
    $scope.$watchCollection('task.flags', save);

});