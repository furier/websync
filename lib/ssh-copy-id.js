/**
 * Created by sander.struijk on 10.07.14.
 */
'use strict';

var exec = require('child_process').exec;

//Required packages
//sshpass && ssh-copy-id

module.exports = function (io) {

    io.on('sshcopyid', function (data) {
        _sshCopyId(data.id, data.username, data.password, data.host, data.port);
    });

    function _command(hostId, cmd){
        var child = exec(cmd);
        child.stdout.on('data', function (data) {
            io.emit('host.progress.' + hostId, data);
        });
        child.stdout.on('end', function (data) {
            io.emit('host.finished.' + hostId, data);
        });
        child.stderr.on('data', function (data) {
            io.emit('host.error.' + hostId, data);
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