/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.directive('taskHeader', function () {
    return {
        restrict: "E",
        templateUrl: '../views/partials/task/taskHeader.html'
    };
});