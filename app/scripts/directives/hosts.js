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

            var newHost = function(){
                var host = {
                    username: '',
                    host: ''
                };
                hosts.push(host);
            };

            newHost();

        }
    };
});