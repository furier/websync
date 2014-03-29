/**
 * Created by furier on 29/03/14.
 */
'use strict';

angular.module('websyncApp')

    .factory('toolkit', function () {

        function guid() {
            function s4() {
                return Math.floor(Math.random() * 0x10000).toString(16);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        return {
            guid: guid
        };
    });