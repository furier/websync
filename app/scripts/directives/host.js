/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function ($modal, $socket, hostManager, toolkit) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: '../../views/partials/host.html',
        controller: function ($scope, $element, $attrs) {

            var host = $scope.host;

            function _prevBlankHosts(host) {
                var blankHosts = [];

                function __prevBlankHosts(host) {
                    if (host && host.isBlank()) {
                        blankHosts.push(host);
                        __prevBlankHosts(host.prevHost());
                    }
                }

                __prevBlankHosts(host.prevHost());
                return blankHosts;
            }

            function _nextBlankHosts(host) {
                var blankHosts = [];

                function __nextBlankHosts(host) {
                    if (host && host.isBlank()) {
                        blankHosts.push(host);
                        __nextBlankHosts(host.nextHost());
                    }
                }

                __nextBlankHosts(host.nextHost());
                return blankHosts;
            }

            function _processHost(host) {
                var message = 'Host.id: ' + host.id;

                if (host.isSingle()) {
                    message += ' is the only host in the list';
                    if (!host.isBlank()) {
                        message += ' and it is not blank, therefore we add a new and blank host to the bottom of the list.';
                        hostManager.newHost();
                    }
                }
                else if (host.isFirst()) {
                    message += ' is the first host in the list.';
                    if (host.isBlank()) {
                        message += ' and it is blank.';
                        var blankHosts = _nextBlankHosts(host);
                        blankHosts.forEach(function (blankHost) {
                            message += ' next sibling is also blank, removing next sibling host...';
                            blankHost.delete();
                        });
                    }
                }
                else if (host.isLast()) {
                    message += ' is the last host in the list';
                    if (host.isBlank()) {
                        message += ' and it is blank.'
                        var blankHosts = _prevBlankHosts(host);
                        blankHosts.forEach(function (blankHost) {
                            message += ' previous sibling is also blank, removing previous sibling host...';
                            blankHost.delete();
                        });
                    } else {
                        message += ' and it is not blank, therefore we add a new and blank host to the bottom of the list.';
                        hostManager.newHost();
                    }
                }
                else if (host.isBlank()) {
                    message += ' is blank.';
                    var blankHosts = _nextBlankHosts(host);
                    var lastBlankHost = _.last(blankHosts);
                    if (lastBlankHost && lastBlankHost.index() === hostManager.lastIndex()) {
                        blankHosts.forEach(function (blankHost) {
                            message += ' next sibling is also blank, removing next sibling host...';
                            blankHost.delete();
                        });
                        blankHosts = _prevBlankHosts(host);
                        blankHosts.forEach(function (blankHost) {
                            message += ' prev sibling is also blank, removing prev sibling host...';
                            blankHost.delete();
                        });
                    }
                }

                console.debug(message);
            }

            var _save = function (n, o) {
                if (n === o) return;
                _processHost(host);
                toolkit.delayAction('host', function () {
                    host.save();
                }, 500);
            };

            $scope.showSshCopyIdModal = function () {
                $modal.open({
                    templateUrl: '../../../views/partials/sshCopyIdModal.html',
                    controller: function ($scope, $modalInstance, $socket) {

                        $scope.id = host.id;
                        $scope.output = [];
                        var btn;

                        function _getType(msg) {
                            if (_.startsWith(msg, 'WARNING: '))
                                return 'list-group-item-warning';
                            if (_.startsWith(msg, 'ERROR: '))
                                return 'list-group-item-danger';
                            return 'list-group-item-info';
                        }

                        function _stripType(msg) {
                            if (_.startsWith(msg, 'INFO: '))
                                return _.strRight(msg, 'INFO: ');
                            if (_.startsWith(msg, 'WARNING: '))
                                return _.strRight(msg, 'WARNING: ');
                            if (_.startsWith(msg, 'ERROR: '))
                                return _.strRight(msg, 'ERROR: ');
                            return msg;
                        }

                        function _parseOutput(msg) {
                            return {
                                msg: _stripType(msg),
                                type: _getType(msg)
                            };
                        }

                        $socket.on('host.finished.' + host.id, $scope, function (data) {
                            if (btn) btn.button('reset');
                            if (data) {
                                $scope.output.push(_parseOutput(data));
                                console.log('host.finished: ' + data);
                            }
                        });

                        $socket.on('host.progress.' + host.id, $scope, function (data) {
                            if (!data) return;
                            $scope.output.push(_parseOutput(data));
                            console.log('host.progress: ' + data);
                        });

                        $socket.on('host.error.' + host.id, $scope, function (data) {
                            if (!data) return;
                            $scope.output.push(_parseOutput(data));
                            console.log('host.progress: ' + data);
                        });

                        $scope.sshCopyId = function (password, $event) {
                            btn = $($event.target);
                            btn.button('loading');
                            $socket.emit('sshcopyid', {
                                id: host.id,
                                username: host.username,
                                password: password,
                                host: host.host,
                                port: host.port
                            });
                        };

                    }
                });
            };

            $scope.removeHost = function () {
                // The last item in the host list should always be an empty item
                // which is used to add new hosts, so we don't want to remove that one.
                if (host.isLast() && host.isBlank()) return;
                host.delete();
            };

            $scope.isLastAndBlank = function () {
                return host.isBlank() && host.isLast();
            };

            $scope.$watch('host.alias', _save);
            $scope.$watch('host.username', _save);
            $scope.$watch('host.host', _save);
            $scope.$watch('host.port', _save);

        }
    };
};