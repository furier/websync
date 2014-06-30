/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

app.directive('dirNavigator', function(directoryService) {
    return {
        restrict: 'E',
        scope: {target: '='},
        link: function (scope, element, attrs) {

            var treeView = $(element);

            scope.$watch('showHiddenFiles', function () {

            })

            scope.$watch('target', function () {

                directoryService.getStructure('/').then(function(data){
                    treeView.jstree({
                        core: {
                            data: data
                        },
                        types: {
                            directory: {
                                icon: 'glyphicon glyphicon-folder-close',
                                valid_children: ['directory', 'file']
                            },
                            file: {
                                icon: 'glyphicon glyphicon-file',
                                valid_children: []
                            }
                        },
                        plugins: [
                            'types'
                        ]
                    });
                });

            }, true);

        }
    };
});