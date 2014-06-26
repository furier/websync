/**
 * Created by furier on 29/03/14.
 */
'use strict';

app.factory('rsyncMetaData', function (Restangular) {
    return {
        flags: Restangular.all('flags').getList().$object
    };
});