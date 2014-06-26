/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

app.directive('jstree', function() {
    return {
        restrict: 'E',
        scope: {data: '='},
        link: function (scope, element, attrs) {

            var treeView = $(element);

            scope.$watch('data', function (data) {
                data.then(function(data){
                    treeView.jstree({
                        core: {
                            data: data
                        },
                        types: {
                            directory: {
                                valid_children: ['directory', 'file']
                            },
                            file: {
                                valid_children: []
                            }
                        }
                    });
                })
            })
        }
    };
});