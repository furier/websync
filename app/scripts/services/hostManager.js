/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.factory('hostManager', function (toolkit, Restangular) {

    var hasBeenInitializes = false;
    var guid = toolkit.guid;
    var hosts = Restangular.all('hosts').getList().$object;

    Restangular.extendModel('hosts', function(host) {
        host.first = true;
        extendHostModel(host);
        return host;
    });

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
        host.save = function () {
            saveHost(host);
        };
        host.delete = function () {
            removeHost(host);
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

    return {
        hosts: hosts,
        saveHost: saveHost,
        removeHost: removeHost,
        newHost: function(){
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
        },
        lastIndex: function () {
            return hosts.length - 1;
        },
        init: function(){
            if (hasBeenInitializes) return;
            if (hosts.length === 0 || !_.last(hosts).isBlank())
                this.newHost();
            hasBeenInitializes = true;
        }
    };
});