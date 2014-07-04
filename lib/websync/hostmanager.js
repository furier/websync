/**
 * Created by sander.struijk on 04.07.14.
 */
'use strict';

var _ = require('lodash'),
    jf = require('jsonfile'),
    path = require('path'),
    file = path.normalize(__dirname + '/../../hosts.json');

module.exports = (function () {

    var hosts = [];

    function _readHostsFromFile() {
        jf.readFile(file, function (err, obj) {
            if (err) {
                console.log(err);
                return;
            }
            hosts = obj.hosts;
            console.log('Hosts (' + hosts.length + ') read as JSON from file: ' + file);
        });
    }

    function _saveHostsToFile() {
        jf.writeFile(file, {hosts: hosts}, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Hosts (' + hosts.length + ') saved as JSON to file: ' + file);
        });
    }

    function findHost(id) {
        var host = _.find(hosts, function (h) {
            return h.id === id;
        });
        if (host) {
            console.log('Found host.id: ' + id);
            return host;
        }
        console.log('Could not find host.id: ' + id);
    }

    function replaceHost(oldHost, newHost) {
        var indexOfHost2Replace = hosts.indexOf(oldHost);
        hosts.splice(indexOfHost2Replace, 1, newHost);
        console.log('Replaced old host with new host.');
    }

    function removeHost(id) {
        var host = _.remove(hosts, function (t) {
            return t.id === id;
        });
        if (host && _.some(host)) {
            console.log('Removed host.id: ' + id);
            _saveHostsToFile();
            return _.first(host);
        }
    }

    function saveHost(host) {
        var exist = findHost(host.id);
        if (exist) {
            replaceHost(exist, host);
            _saveHostsToFile();
            console.log('Updated host.id: ' + host.id);
        } else {
            hosts.push(host);
            _saveHostsToFile();
            console.log('Added host.id: ' + host.id);
            return host;
        }
    }

    (function init() {
        _readHostsFromFile();
        console.log('Initialized hosts manager.');
    })();

    return {
        hosts: function(){return hosts;},
        findHost: findHost,
        replaceHost: replaceHost,
        removeHost: removeHost,
        saveHost: saveHost
    };
}());