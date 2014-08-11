/**
 * Created by sander.struijk on 10.07.14.
 */
'use strict';

module.exports = function (Restangular) {
    return {
        sshCopyId: function (id, username, password, host, port) {
            return Restangular.one('sshCopyId').customPOST({
                id: id,
                username: username,
                password: password,
                host: host,
                port: port
            });
        }
    };
};