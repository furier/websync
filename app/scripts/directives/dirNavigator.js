/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

app.directive('dirNavigator', function(directoryService) {
    return {
        restrict: 'E',
        scope: {target: '='},
        templateUrl: '../views/partials/dirNavigator.html',
        link: function (scope, element, attrs) {

            scope.dirs = [
                {
                    text: 'Root',
                    path: '/',
                    type: 'directory',
                    children: []
                }
            ];
            scope.children = [];

            function _setRootChildren(rootDir) {
                directoryService.getStructure(rootDir.path).then(function (files) {
                    scope.children = files;
                    rootDir.children = files;
                });
            }

            function _initRootChildren(rootDir, n, o) {
                if (rootDir.children.length < 1 || n.host !== o.host)
                    _setRootChildren(rootDir);
                else
                    scope.children = rootDir.children;
            }

            scope.$watch('target', function (n, o) {

                var rootDir = scope.dirs[0];
                _initRootChildren(rootDir, n, o);

            }, true);

            scope.getChildren = function(selectedChild){
                if (selectedChild.type === 'directory'){
                    directoryService.getStructure(selectedChild.path).then(
                        function sucess(files) {
                            selectedChild.children = files;
                            scope.dirs.push(selectedChild);
                            scope.children = selectedChild.children;
                        },
                        function failure(err){
                            selectedChild.disabled = true;
                            var error = err.data.error;
                            alertify.error('The item clicked was inaccessible.');
                            console.error(error.message);
                        });
                } else
                    scope.children = [];
            }

            scope.goBack = function(selectedChild){
                if (selectedChild.type === 'directory') {
                    var index = scope.dirs.indexOf(selectedChild);
                    scope.dirs.splice(index + 1);
                    scope.children = selectedChild.children;
                }
            }

        }
    };
});