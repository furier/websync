/**
 * Created by sander.struijk on 20.06.14.
 */
'use strict';

app.directive('task', function () {
    return {
        restrict: "E",
        rep1ace: true,
        templateUrl: '../views/partials/task.html'
    };
});