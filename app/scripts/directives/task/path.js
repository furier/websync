/**
 * Created by sander.struijk on 07.07.14.
 */
'use strict';

module.exports = function ($modal, pathHelper, $socket) {
    return {
        restrict: 'E',
        replace: true,
        scope: {task: '=', path: '='},
        templateUrl: '../../../views/partials/task/path.html',
        link: function (scope, element, attrs) {

            var ph = pathHelper;
            var task = scope.task;
            var path = scope.path;
            scope.sourceOptions = [];
            scope.destinationOptions = [];

            scope.removePath = function () {
                task.removePath(path);
            };

            scope.clonePath = function () {
                task.injectAfterPath(path, ph.createPath(path.source, path.destination));
            };

            scope.isBlank = function () {
                return ph.isBlank(path);
            };

            scope.isBlankAndLast = function () {
                return ph.isLast(task.paths, path) && ph.isBlank(path);
            };

            scope.browse = function () {
                $modal.open({
                    templateUrl: '../../../views/partials/browserModal.html',
                    controller: function ($scope, $modalInstance) {

                        $scope.ok = function () {

                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };

                    }
                });
            };

            function _getChildrenForPath(pathObj, callback) {
                //TODO: Needs to be fixed if to support windows in the future.
                $socket.emit('path.getChildren', pathObj || {name: '/', type: 'directory'}, function (err, children) {
                    if (err)
                        console.error(err);
                    callback(children);
                });
            }

            scope.$watch('path.source.name', function () {
                _getChildrenForPath(path.source, function (children) {
                    scope.sourceOptions = children;
                });
            });
            scope.$watch('path.destination.name', function () {
                _getChildrenForPath(path.destination, function (children) {
                    scope.destinationOptions = children;
                });
            });

            scope.$watch('path', function (n, o) {
                //task.saveDelayed(n, o);
            }, true);
        }
    };
};