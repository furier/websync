/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function (toolkit, Restangular) {

    var guid = toolkit.guid;
    var hostsPromise = Restangular.all('hosts').getList();
    var hosts = hostsPromise.$object;

    hostsPromise.then(function (hosts) {
        if (hosts) {
            var empty = _.isEmpty(hosts);
            if (!empty) {
                var blank = _.last(hosts).isBlank();
                if (!blank)
                    newHost();
            } else {
                newHost();
            }
        }
    });

    Restangular.extendModel('hosts', function (host) {

        if (!host.id) host.id = guid();

        host.isBlank = function () {
            return !(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== '');
        };
        host.isSingle = function () {
            return hosts.length === 1;
        };
        host.isFirst = function () {
            return hosts.indexOf(host) === 0;
        };
        host.isLast = function () {
            return hosts.indexOf(host) === hosts.length - 1;
        };
        host.nextHost = function () {
            if (host.isLast()) return null;
            var index = hosts.indexOf(host);
            return hosts[index + 1];
        };
        host.prevHost = function () {
            if (host.isFirst()) return null;
            var index = hosts.indexOf(host);
            return hosts[index - 1];
        };
        host.index = function () {
            return hosts.indexOf(host);
        };
        host.isPrevHostBlank = function () {
            var prevHost = host.prevHost();
            return prevHost && prevHost.isBlank();
        };
        host.isNextHostBlank = function () {
            var nextHost = host.nextHost();
            return nextHost && nextHost.isBlank();
        };
        host.save = function () {
            saveHost(host);
        };
        host.delete = function () {
            removeHost(host);
        };

        return host;
    });

    function _createHost() {
        return {
            id: guid(),
            alias: '',
            username: '',
            host: '',
            port: ''
        };
    }

    var saveHost = function (host) {
        console.debug('Saving host: ' + host.id);
        host.put();
    };

    var removeHost = function (host) {
        console.debug('Removing host: ' + host.id);
        _.remove(hosts, host);
        host.remove();
    };

    var newHost = function () {
        var host = _createHost();
        hosts.post(host).then(function (host) {
            console.debug('Adding host.id: ' + host.id);
            hosts.push(host);
        });
    };

    return {
        hosts: hosts,
        saveHost: saveHost,
        removeHost: removeHost,
        newHost: newHost,
        lastIndex: function () {
            return hosts.length - 1;
        }
    };
};