/**
 * Created by sander.struijk on 07.07.14.
 */
'use strict';

module.exports = function ($modal, pathHelper) {
    return {
        restrict: 'E',
        replace: true,
        scope: {task: '=', path: '='},
        templateUrl: '../../../views/partials/task/path.html',
        link: function (scope, element, attrs) {

            var ph = pathHelper;
            var task = scope.task;
            var path = scope.path;

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
                    controller: 'BrowserCtrl'
                });
            };

            scope.$watch('path', function (n, o) {
                task.paths = ph.evalPaths(task.paths, path);
                task.saveDelayed(n, o);
            }, true);
        }
    };
};