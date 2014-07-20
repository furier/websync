/**
 * Created by sander.struijk on 24.06.14.
 */
'use strict';

var React = require('react');

//<div class="form-group panel panel-default">
//    <div class="panel-heading">
//        <h5 class="panel-title" style="display: inline;">Log</h5>
//        <button type="button" class="btn btn-default btn-xs pull-right" ng-click="logCollapsed = !logCollapsed"
//        ng-switch on="logCollapsed">
//            <span ng-switch-when="true" class="glyphicon glyphicon-plus"></span>
//            <span ng-switch-when="false" class="glyphicon glyphicon-minus"></span>
//        </button>
//    </div>
//    <ul collapse="logCollapsed" class="list-group" style="max-height: 300px; overflow: scroll;" scroll-glue>
//        <li ng-repeat="item in log" class="list-group-item" ng-class="item.type">{{item.msg}}</li>
//    </ul>
//</div>

module.exports = function (reactComponents) {
    return {
        restrict: 'E',
        scope: {
            logEntries: '=',
            panelHeader: '@'
        },
        link: function (scope, element, attributes) {
            scope.$watchCollection('logEntries', function (n, o) {
                React.renderComponent(reactComponents.LogPanel({
                    header: scope.panelHeader,
                    logEntries: scope.logEntries
                }), element[0]);
            });
        }
    };
};