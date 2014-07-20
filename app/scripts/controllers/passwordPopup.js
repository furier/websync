/**
 * Created by sander.struijk on 11.07.14.
 */
'use strict';

module.exports = function ($scope) {

    $scope.pw = '';

    $scope.sshCopyId = function (password) {
        console.log('button clicked!');
    };

    $scope.$watch('pw', function (n,o) {
        console.log(n);
    });

};