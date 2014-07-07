/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.factory('hostManager', function (toolkit, Restangular) {

    Restangular.extendModel('hosts', function(host) {
        host.first = true;
        extendHostModel(host);
        return host;
    });

    var hosts = Restangular.all('hosts').getList().$object || [];

    function extendHostModel(host) {
        host.isBlank = function () {
            return !(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== '');
        };
        host.isSingle = function () {
            return hosts.length === 1;
        };
        host.isFirst = function() {
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
        host.index = function() {
            return hosts.indexOf(host);
        };
        host.hasPrecedingBlankSiblings = function() {
            var prevHost = host.prevHost();
            return prevHost && prevHost.isBlank();
        };
        host.hasSucceedingBlankSiblings = function() {
            var nextHost = host.nextHost();
            return nextHost && nextHost.isBlank();
        };
    }

    var guid = toolkit.guid;

    var newHost = function(){
        var host = {
            id: guid(),
            alias: '',
            username: '',
            host: '',
            port: '',
            first: true
        };
        hosts.post(host).then(function(host){
            console.log('Adding host.id: ' + host.id);
            hosts.push(host);
        });
    };

    var removeHost = function (host) {
        console.debug('Removing host: ' + host.id);
        _.remove(hosts, host);
        host.remove();
    };

    var saveHost = function (host) {
        console.debug('Saving host: ' + host.id);
        host.put();
    };

    var lastIndex = function(){
        return hosts.length - 1;
    };

    return {
        hosts: hosts,
        newHost: newHost,
        saveHost: saveHost,
        removeHost: removeHost,
        lastIndex: lastIndex
    };
});