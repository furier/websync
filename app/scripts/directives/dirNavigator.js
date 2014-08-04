/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

module.exports = function (directoryService, alertify) {
    return {
        restrict: 'E',
        scope: {target: '='},
        templateUrl: '../../views/partials/dirNavigator.html',
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

            function _pushDir(selectedChild) {
                var lastItem = _.last(scope.dirs);
                if (lastItem && lastItem.type !== 'file')
                    scope.dirs.push(selectedChild);
                else
                    scope.dirs[scope.dirs.indexOf(lastItem)] = selectedChild;
            }

            scope.getChildren = function (selectedChild) {
                switch (selectedChild.type) {
                    case 'directory' :
                        directoryService.getStructure(selectedChild.path).then(
                            function success(files) {
                                selectedChild.children = files;
                                _pushDir(selectedChild);
                                scope.children = selectedChild.children;
                            },
                            function failure(err) {
                                selectedChild.disabled = true;
                                var error = err.data.error;
                                alertify.error('The item clicked was inaccessible.');
                                console.error(error.message);
                            });
                        break;
                    default :
                        selectedChild.selected = true;
                        _pushDir(selectedChild);
                        break;
                }
            };

            scope.goBack = function (selectedChild) {
                switch (selectedChild.type) {
                    case 'directory' :
                        var index = scope.dirs.indexOf(selectedChild);
                        scope.dirs.splice(index + 1);
                        scope.children = selectedChild.children;
                        break;
                }
            };

            scope.$watch('target', function (n, o) {

                var rootDir = scope.dirs[0];
                _initRootChildren(rootDir, n, o);

            }, true);

            scope.$watchCollection('dirs', function (n, o) {

                var pathElements = element.find('div.path-elements')[0];
                pathElements.scrollLeft = pathElements.scrollWidth;

            });

        }
    };
};