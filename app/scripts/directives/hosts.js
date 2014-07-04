/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.directive('hosts', function (hostManager) {
    return {
        restrict: "E",
        templateUrl: '../views/partials/hosts.html',
        link: function (scope, element, attrs) {

            var hosts = scope.hosts = hostManager.hosts;

            (function init(){
                if (hosts.length === 0 || !_.last(hosts).isBlank())
                    hostManager.newHost();
            }());

        }
    };
});