/**
 * Created by sander.struijk on 07.07.14.
 */
'use strict';

app.directive('path', function ($modal) {
    return {
        restrict: 'E',
        replace: true,
        scope: {task: '=', path: '='},
        templateUrl: '../../../views/partials/task/path.html',
        link: function (scope, element, attrs) {

            var task = scope.task;
            var path = scope.path;

            scope.removePath = function(){
                task.removePath(path);
            };

            scope.browse = function(){
                $modal.open({
                    templateUrl: '../../../views/partials/browserModal.html',
                    controller: 'BrowserCtrl'
                });
            };

        }
    };
});