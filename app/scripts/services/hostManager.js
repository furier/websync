/**
 * Created by sander.struijk on 03.07.14.
 */
'use strict';

app.factory('hostManager', function (toolkit, Restangular) {

    var guid = toolkit.guid;
    var hosts = Restangular.all('hosts').getList().$object || [];

    return {
        hosts: hosts
    };
});