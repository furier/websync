/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.directive('taskFooter', function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: '../../../views/partials/task/taskFooter.html'
    };
});