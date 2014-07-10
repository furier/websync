/**
 * Created by sander.struijk on 10.07.14.
 */
'use strict';

var sh = require('sh');

//Required packages
//sshpass && ssh-copy-id

module.exports = {
    sshCopyId: function (username, password, host, port) {
        console.info('Trying to copy ssh id to target: ' + host + ' as: ' + username);
        return port ? sh("sshpass -p '" + password + "' ssh-copy-id -p " + port + " " + username + "@" + host)
                    : sh("sshpass -p '" + password + "' ssh-copy-id " + username + "@" + host);
    }
};