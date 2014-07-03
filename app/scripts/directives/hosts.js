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

            scope.$watch('hosts', function (n, o) {
                var blankCount = -1;
                var index = _.findLastIndex(hosts, function (host) {
                    var notBlank = host.username !== '' || host.host !== '';
                    if (!notBlank)
                        blankCount++;
                    return  notBlank;
                });
                var lastIndex = hosts.length - 1;
                if (index === lastIndex)
                    newHost();
                else if (blankCount > 0)
                    hosts.splice(lastIndex - blankCount);
            }, true);

        }
    };
});