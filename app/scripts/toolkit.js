/**
 * Created by furier on 29/03/14.
 */
'use strict';

app.factory('toolkit', function ($timeout) {

    function guid() {
        function s4() {
            return Math.floor(Math.random() * 0x10000).toString(16);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function delayAction(promise, callback, time){
        if (promise) $timeout.cancel(promise);
        promise = $timeout(function () {
            callback();
        }, time);
    }

    return {
        guid: guid,
        delayAction: delayAction
    };
});