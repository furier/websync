'use strict';

angular.module('ngSocket', []).factory('$socket', ['$rootScope', function ($rootScope) {
    //Check if socket is undefined
    if (typeof socket === 'undefined') {
      var socket = io();
    }
    //
    var angularCallback = function (callback) {
      return function () {
        if (callback) {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        }
      };
    };

    var addListener = function (name, scope, callback) {
      if (arguments.length === 2) {
        scope = null;
        callback = arguments[1];
      }

      socket.on(name, angularCallback(callback));

      if (scope !== null) {
        scope.$on('$destroy', function () {
          removeListener(name, callback);
        });
      }
    };

    var removeListener = function (name, callback) {
      socket.removeListener(name, angularCallback(callback));
    };

    var removeAllListeners = function (name) {
      socket.removeAllListeners(name);
    };

    var emit = function (name, data, callback) {
      socket.emit(name, data, angularCallback(callback));
    };

    return {
      addListener: addListener,
      on: addListener,
      removeListener: removeListener,
      removeAllListeners: removeAllListeners,
      emit: emit
    };
}]);
