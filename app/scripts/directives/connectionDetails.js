/**
 * Created by sander.struijk on 25.06.14.
 */
'use strict';

app.directive('connectionDetails', function (taskManager) {
    return {
        restrict: "E",
        scope: {task: '=', target: '='},
        templateUrl: '../views/partials/connectionDetails.html',
        link: function (scope, element, attrs) {

            function save(n, o) {
                taskManager.saveTaskWatch(n, o ,scope.task);
            }

            scope.$watch('target.connectionType', save);
            scope.$watch('target.host', save);
            scope.$watch('target.username', save);

        }
    };
});