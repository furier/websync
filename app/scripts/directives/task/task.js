/**
 * Created by sander.struijk on 20.06.14.
 */
'use strict';

module.exports = function ($socket, pathHelper) {
    return {
        restrict: "E",
        templateUrl: '../../../views/partials/task/task.html',
        controller: function ($scope, $element, $attrs) {

            var task = $scope.task;
            var log = $scope.log = [];
            var ph = pathHelper;
            var paths = task.paths;

            if (!ph.isLastBlank(paths)) {
                paths.push(ph.createPath());
            }

            $socket.on('task.finished.' + task.id, $scope, function (data) {
                task.inProgress = false;
                if (data && data.error) {
                    var msg = data.error + ' (' + data.errorCode.message + ')';
                    log.push({type: 'list-group-item-danger', msg: msg});
                    log.push({type: 'list-group-item-danger', msg: data.cmd });
                } else {
                    log.push({type: 'list-group-item-success', msg: 'Task finished Successfully!'});
                    log.push({type: 'list-group-item-success', msg: data.cmd});
                }
            });

            $socket.on('task.progress.' + task.id, $scope, function (data) {
                if (data) {
                    task.inProgress = true;
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

            $socket.on('task.error.' + task.id, $scope, function (data) {
                log.push({type: 'list-group-item-danger', msg: data});
            });

            $scope.$watch('task.name', task.saveDelayed);
            $scope.$watch('task.source.host', task.saveDelayed);
            $scope.$watch('task.destination.host', task.saveDelayed);
            $scope.$watch('task.schedule.enabled', task.saveDelayed);
            $scope.$watch('task.schedule.time', task.saveDelayed);
            $scope.$watchCollection('task.flags', task.saveDelayed);

        }
    };
};
