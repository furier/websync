/**
 * Created by furier on 06/04/14.
 */
'use strict';

app.controller('TaskCtrl', function ($scope, taskManager, socket) {

    var task = $scope.task;
    var log = $scope.log = [];

    var save = function (n, o) {
        taskManager.saveTaskWatch(n, o, task);
    };

    socket.on('task.finished.' + task.id, function (data) {
        if (data && data.error) {
            var msg = data.error + ' (' + data.errorCode.message + ')';
            log.push({type: 'list-group-item-danger', msg: msg});
            log.push({type: 'list-group-item-danger', msg: data.cmd });
        } else {
            log.push({type: 'list-group-item-success', msg: 'Task finished Successfully!'});
            log.push({type: 'list-group-item-success', msg: data.cmd});
        }
    });

    socket.on('task.progress.' + task.id, function (data) {
        if (data) {
            var strip = 'rsync:';
            var stripError = 'rsync error:';
            if (_.startsWith(data, strip)) {
                data = _(data.substring(strip.length)).chain().trim().capitalize();
                log.push({type: 'list-group-item-info', msg: data});
            } else if (_.startsWith(data, stripError)) {
                data = _(data.substring(stripError.length)).chain().trim().capitalize();
                log.push({type: 'list-group-item-danger', msg: data});
            } else {
                log.push({type: 'list-group-item-info', msg: data});
            }
        }
    });

    socket.on('task.error.' + task.id, function (data) {
        log.push({type: 'list-group-item-danger', msg: data});
    });

    $scope.$watch('task.name', save);
    $scope.$watchCollection('task.flags', save);

});