/**
 * Created by furier on 04/08/14.
 */

var path = require('path'),
    EventEmitter = require('events').EventEmitter;

var _ = require('lodash'),
    jf = require('jsonfile');

var file = path.normalize(__dirname + '/../../wsdata.json'),
    eventEmitter = new EventEmitter();

function readDataFromFile() {
    jf.readFile(file, function (err, content) {
        if (err) {
            console.log(err);
            return;
        }
        wsDAO.hosts = content.hosts;
        wsDAO.tasks = content.tasks;
        console.log('Hosts (' + wsDAO.hosts.length + ') read as JSON from file: ' + file);
        console.log('Tasks (' + wsDAO.tasks.length + ') read as JSON from file: ' + file);
        eventEmitter.emit('ready');
    });
}

function saveDataToFile() {
    _removeBlankHosts(wsDAO.hosts);
    jf.writeFile(file, {
        hosts: wsDAO.hosts,
        tasks: wsDAO.tasks
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Hosts (' + wsDAO.hosts.length + ') saved as JSON to file: ' + file);
        console.log('Tasks (' + wsDAO.tasks.length + ') saved as JSON to file: ' + file);
        eventEmitter.emit('saved');
    });
}

function _removeBlankHosts(hosts) {
    _.remove(hosts, function (host) {
        return !(host.alias !== '' || host.username !== '' || host.host !== '' || host.port !== '');
    });
}

readDataFromFile();

var wsDAO = module.exports = {
    hosts: [],
    tasks: [],
    readDataFromFile: readDataFromFile,
    saveDataToFile: saveDataToFile,
    e: eventEmitter
};

