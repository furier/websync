/**
 * Created by sander.struijk on 04.07.14.
 */
'use strict';

var path = require('path'),
    _ = require('lodash'),
    jf = require('jsonfile'),
    file = path.normalize(__dirname + '/../../wsdata.json');

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
    _removeBlankHosts(hostManager.hosts);
    jf.writeFile(file, {hosts: hostManager.hosts}, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Hosts (' + hostManager.hosts.length + ') saved as JSON to file: ' + file);
    });
}

function _removeBlankHosts(hosts) {
    _.remove(hosts, function (host) {
        return !(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== '');
    });
}

_readHostsFromFile();
console.log('Initialized hosts manager.');

var hostManager = module.exports = {
    hosts: [],
    findHost: function(id) {
        var host = _.find(this.hosts, function (h) {
            return h.id === id;
        });
        if (host) {
            console.log('Found host.id: ' + id);
            return host;
        }
        console.log('Could not find host.id: ' + id);
        return null;
    },
    replaceHost: function(oldHost, newHost) {
        var indexOfHost2Replace = this.hosts.indexOf(oldHost);
        this.hosts.splice(indexOfHost2Replace, 1, newHost);
        console.log('Replaced old host with new host.');
    },
    removeHost: function(id) {
        var host = _.remove(this.hosts, function (t) {
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
            // If host does not exist and is blank, don't store it to file, just return it...
            if (!(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== ''))
                return host;
            this.hosts.push(host);
            _saveHostsToFile();
            console.log('Added host.id: ' + host.id);
            return host;
        }
    }
};