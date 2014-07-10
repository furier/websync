/**
 * Created by sander.struijk on 10.07.14.
 */
'use strict';

app.factory('sshHelper', function (Restangular) {
    return {
        sshCopyId: function (username, password, host, port) {
            return Restangular.one('sshCopyId').customPOST({
                username: username,
                password: password,
                host: host,
                port: port
            });
        }
    };
});