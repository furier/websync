/**
 * Created by sander.struijk on 04.07.14.
 */
'use strict';

var path = require('path'),
    _ = require('lodash'),
    jf = require('jsonfile'),
    file = path.normalize(__dirname + '/../../hosts.json');

function _readHostsFromFile() {
    jf.readFile(file, function (err, obj) {
        if (err) {
            console.log(err);
            return;
        }
        hostManager.hosts = obj.hosts;
        console.log('Hosts (' + hostManager.hosts.length + ') read as JSON from file: ' + file);
    });
}

function _saveHostsToFile() {
    jf.writeFile(file, {hosts: hostManager.hosts}, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Hosts (' + hostManager.hosts.length + ') saved as JSON to file: ' + file);
    });
}

_readHostsFromFile();
console.log('Initialized hosts manager.');

var hostManager = module.exports = {
    hosts: [],
    findHost: function(id) {
        var host = _.find(hosts, function (h) {
            return h.id === id;
        });
        if (host) {
            console.log('Found host.id: ' + id);
            return host;
        }
        console.log('Could not find host.id: ' + id);
    },
    replaceHost: function(oldHost, newHost) {
        var indexOfHost2Replace = hosts.indexOf(oldHost);
        hosts.splice(indexOfHost2Replace, 1, newHost);
        console.log('Replaced old host with new host.');
    },
    removeHost: function(id) {
        var host = _.remove(hosts, function (t) {
            return t.id === id;
        });
        if (host && _.some(host)) {
            console.log('Removed host.id: ' + id);
            _saveHostsToFile();
            return _.first(host);
        }
    },
    saveHost: function(host) {
        var exist = this.findHost(host.id);
        if (exist) {
            this.replaceHost(exist, host);
            _saveHostsToFile();
            console.log('Updated host.id: ' + host.id);
        } else {
            hosts.push(host);
            _saveHostsToFile();
            console.log('Added host.id: ' + host.id);
            return host;
        }
    }
};