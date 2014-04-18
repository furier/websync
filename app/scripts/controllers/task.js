/**
 * Created by furier on 06/04/14.
 */
'use strict';

app.controller('TaskCtrl', function ($scope, taskManager, socket) {

    var timeout = null;
    var task = $scope.task;

    var save = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (task.first) {
                task.first = false;
                return;
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                taskManager.saveTask(task);
            }, 5000);
        }
    };

    socket.on('task.finished.' + task.id, function (data) {
        if(data && data.error)
            console.log(task.name + ' has finished with an ' + data.error);
        else
            console.log(task.name + ' finished successfully!');
    });

    socket.on('task.progress.' + task.id, function (data) {
        console.log(task.name + ': ' + data);
    });

    socket.on('task.error.' + task.id, function (data) {
        console.log(task.name + ': ' + data);
    });

    $scope.$watch('task.name', save);
    $scope.$watch('task.source', save);
    $scope.$watch('task.destination', save);
    $scope.$watch('task.shell', save);
    $scope.$watchCollection('task.flags', save);

});