/**
 * Created by furier on 29/03/14.
 */
'use strict';

module.exports = function (Restangular) {
    return {
        flags: Restangular.all('flags').getList().$object
    };
};