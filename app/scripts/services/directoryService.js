/**
 * Created by sander.struijk on 26.06.14.
 */
'use strict';

app.factory('directoryService', function (Restangular) {
    return {
        getStructure: function (path) {
            return Restangular.one('getDirectoryStructure').customPOST({
                path: path
            });
        }
    };
});