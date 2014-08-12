/**
 * Created by sander.struijk on 10.07.14.
 */
'use strict';

var exec = require('child_process').exec;

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

//Required packages
//sshpass && ssh-copy-id

module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('sshcopyid', function (data) {
            _sshCopyId(data.id, data.username, data.password, data.host, data.port);
        });
    });

    function _trimOutput(line){
        line = _.trim(line, '\n');
        line = _.strRight(line, '/usr/local/bin/ssh-copy-id: ');
        return line;
    }

    function _command(hostId, cmd){
        var child = exec(cmd);
        child.stdout.on('data', function (data) {
            io.emit('host.progress.' + hostId, _trimOutput(data));
        });
        child.stdout.on('end', function (data) {
            io.emit('host.finished.' + hostId, _trimOutput(data));
        });
        child.stderr.on('data', function (data) {
            io.emit('host.error.' + hostId, _trimOutput(data));
        });
    }

    function _sshCopyId(hostId, username, password, host, port) {
        console.info('Trying to copy ssh id to target: ' + host + ' as: ' + username);
        if (port)
            _command(hostId, "sshpass -p '" + password + "' ssh-copy-id -p " + port + " " + username + "@" + host);
        else
            _command(hostId, "sshpass -p '" + password + "' ssh-copy-id " + username + "@" + host);
    }
};