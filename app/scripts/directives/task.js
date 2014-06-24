/**
 * Created by sander.struijk on 20.06.14.
 */
'use strict';

app.directive('task', function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: '../views/partials/task.html'
    };
});