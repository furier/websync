/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.directive('host', function (hostManager, toolkit) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: '../../views/partials/host.html',
        controller: function ($scope, $element, $attrs) {

            var host = $scope.host;
            hostManager.init();

            $scope.removeHost = function () {
                // The last item in the host list should always be an empty item
                // which is used to add new hosts, so we don't want to remove that one.
                if (host.isLast()) return;
                host.delete();
            };

            function prevBlankHosts(host){
                var blankHosts = [];
                function _prevBlankHosts(host) {
                    if (host && host.isBlank()){
                        blankHosts.push(host);
                        _prevBlankHosts(host.prevHost());
                    }
                }
                _prevBlankHosts(host.prevHost());
                return blankHosts;
            }

            function nextBlankHosts(host){
                var blankHosts = [];
                function _nextBlankHosts(host){
                    if (host && host.isBlank()){
                        blankHosts.push(host);
                        _nextBlankHosts(host.nextHost());
                    }
                }
                _nextBlankHosts(host.nextHost());
                return blankHosts;
            }

            function processHost(host){
                var message = 'Host.id: ' + host.id;

                if (host.isSingle())
                {
                    message += ' is the only host in the list';
                    if (!host.isBlank())
                    {
                        message += ' and it is not blank, therefore we add a new and blank host to the bottom of the list.';
                        hostManager.newHost();
                    }
                }
                else if (host.isFirst())
                {
                    message += ' is the first host in the list.';
                    if (host.isBlank())
                    {
                        message += ' and it is blank.';
                        var blankHosts = nextBlankHosts(host);
                        blankHosts.forEach(function (blankHost) {
                            message += ' next sibling is also blank, removing next sibling host...';
                            blankHost.delete();
                        });
                    }
                }
                else if (host.isLast())
                {
                    message += ' is the last host in the list';
                    if (host.isBlank())
                    {
                        message += ' and it is blank.'
                        var blankHosts = prevBlankHosts(host);
                        blankHosts.forEach(function (blankHost) {
                            message += ' previous sibling is also blank, removing previous sibling host...';
                            blankHost.delete();
                        });
                    } else
                    {
                        message += ' and it is not blank, therefore we add a new and blank host to the bottom of the list.';
                        hostManager.newHost();
                    }
                }
                else if (host.isBlank())
                {
                    message += ' is blank.';
                    var blankHosts = nextBlankHosts(host);
                    if (_.last(blankHosts).index() === hostManager.lastIndex())
                        blankHosts.forEach(function (blankHost) {
                            message += ' next sibling is also blank, removing next sibling host...';
                            blankHost.delete();
                        });
                }

                message += ' Saving host...';
                host.save();
                console.log(message);
            }

            var save = function (n, o) {
                if (n === o) return;
                if (host.first) {
                    host.first = false;
                    return;
                }
                toolkit.delayAction('host', function(){
                    processHost(host);
                }, 500);
            };

            $scope.$watch('host.alias', save);
            $scope.$watch('host.username', save);
            $scope.$watch('host.host', save);
            $scope.$watch('host.port', save);

        }
    };
});