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

            scope.$watch('target', function () {

                directoryService.getStructure('/').then(function(nodes){
                    treeView.jstree({
                        core: {
                            data: {
                                data: nodes,
                                url: function (node) {
                                    console.log('Get Children for Node.');
                                    return directoryService.getStructure(node.path);
                                }
                            }
                        },
                        types: {
                            directory: {
                                li_attr: {
                                    'ng-hide': false
                                },
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


            treeView.on('open_node.jstree', function (e, data) {
                console.log(data);
            }).on('close_node.jstree', function (e, data) {
                console.log(data);
            }).on('load_node.jstree', function (e, data) {
                console.log(data);
            });

        }
    };
});