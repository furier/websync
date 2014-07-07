/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.factory('hostManager', function (toolkit, Restangular) {

    var guid = toolkit.guid;
    var hosts = [];

    Restangular.extendModel('hosts', function (host) {

        if (!host.id) host.id = guid();

        host.first = true;

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
        host.hasPrecedingBlankSiblings = function () {
            var prevHost = host.prevHost();
            return prevHost && prevHost.isBlank();
        };
        host.hasSucceedingBlankSiblings = function () {
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

    var saveHost = function (host) {
        console.info('Saving host: ' + host.id);
        host.put();
    };

    var removeHost = function (host) {
        console.info('Removing host: ' + host.id);
        _.remove(hosts, host);
        host.remove();
    };

    var newHost = function () {
        var host = {
            id: guid(),
            alias: '',
            username: '',
            host: '',
            port: '',
            first: true
        };
        hosts.post(host).then(function (host) {
            console.info('Adding host.id: ' + host.id);
            hosts.push(host);
        });
    };

    Restangular.all('hosts').getList().then(function (hostz) {
        hosts = hostz;
        var lastHost = _.last(hosts);
        if (hosts.length === 0 || !lastHost.isBlank())
            newHost();
    });

    return {
        hosts: hosts,
        saveHost: saveHost,
        removeHost: removeHost,
        newHost: newHost,
        lastIndex: function () {
            return hosts.length - 1;
        }
    };
});