/**
 * Created by sander.struijk on 04.07.14.
 */
'use strict';

var _ = require('lodash'),
    wsDAO = require('./wsdao');

var hostManager = module.exports = {
    hosts: function () {
        return wsDAO.hosts;
    },
    findHost: function(id) {
        if (!id) return null;
        var host = _.find(wsDAO.hosts, function (h) {
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
        var indexOfHost2Replace = wsDAO.hosts.indexOf(oldHost);
        wsDAO.hosts.splice(indexOfHost2Replace, 1, newHost);
        console.log('Replaced old host with new host.');
    },
    removeHost: function(id) {
        var host = _.remove(wsDAO.hosts, function (t) {
            return t.id === id;
        });
        if (host && _.some(host)) {
            console.log('Removed host.id: ' + id);
            wsDAO.saveDataToFile();
            return _.first(host);
        }
    },
    saveHost: function(host) {
        var exist = this.findHost(host.id);
        if (exist) {
            this.replaceHost(exist, host);
            wsDAO.saveDataToFile();
            console.log('Updated host.id: ' + host.id);
        } else {
            // If host does not exist and is blank, don't store it to file, just return it...
            if (!(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== ''))
                return host;
            wsDAO.hosts.push(host);
            wsDAO.saveDataToFile();
            console.log('Added host.id: ' + host.id);
            return host;
        }
    }
};