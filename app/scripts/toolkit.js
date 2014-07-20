/**
 * Created by furier on 29/03/14.
 */
'use strict';

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function ($timeout) {

    function guid() {
        function s4() {
            return Math.floor(Math.random() * 0x10000).toString(16);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    var promises = {};

    function delayAction(promise, callback, time) {
        if (_.isString(promise)) {
            var timeout = promises[promise];
            if (timeout) $timeout.cancel(timeout);
            promises[promise] = $timeout(function () {
                callback();
            }, time);
        } else {
            if (promise) $timeout.cancel(promise);
            return promise = $timeout(function () {
                callback();
            }, time);
        }
    }

    return {
        guid: guid,
        delayAction: delayAction
    };
};