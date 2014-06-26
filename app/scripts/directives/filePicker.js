/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

app.directive('filePicker', function (directoryService) {
    return {
        restrict: 'E',
        scope: {task: '='},
        templateUrl: '../views/partials/filePicker.html',
        link: function (scope, element, attrs) {

            function joinTargetConnectionInfo(target) {
                return target.password ? target.username + ':' + target.password + '@' + target.host + ':/'
                                       : target.username + '@' + target.host + ':/';
            }

            function getTargetBaseDirectoryStructure(target, o) {
                switch (target.connectionType){
                    case 'ssh':
                        return directoryService.getStructure(joinTargetConnectionInfo);
                    default :
                        return directoryService.getStructure('/'); //get root dir
                }
            }

            scope.$watch('task.source', function (n, o) {
                scope.source = getTargetBaseDirectoryStructure(n, o);
            });
            scope.$watch('task.destination', function (n, o) {
                scope.destination = getTargetBaseDirectoryStructure(n, o);
            });

        }
    }
});