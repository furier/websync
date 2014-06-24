/**
 * Created by sander.struijk on 24.06.14.
 */
'use strict';

// This is the Angular HTML equivalent

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

app.directive('logPanel', function () {
    return {
        restrict: 'E',
        scope: {logEntries: '='},
        link: function (scope, element, attributes) {

            var LogEntry = React.createClass({
                render: function () {
                    return React.DOM.li({
                        className: 'list-group-item ' + this.props.type
                    }, this.props.msg);
                }
            });

            var LogList = React.createClass({
                getDefaultProps: function () {
                    return {
                        logEntries: [],
                        logCollapsed: false
                    };
                },
                componentWillUpdate: function() {
                    var node = this.getDOMNode();
                    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
                },
                componentDidUpdate: function() {
                    if (this.shouldScrollBottom) {
                        var node = this.getDOMNode();
                        node.scrollTop = node.scrollHeight;
                    }
                },
                render: function () {
                    var items = this.props.logEntries.map(function (logEntry) {
                        return LogEntry({msg: logEntry.msg, type: logEntry.type});
                    });
                    return React.DOM.ul({
                        className: 'list-group',
                        style: {
                            'max-height': 300,
                            overflow: 'scroll'
                        },
                        hidden: this.props.logCollapsed
                    }, items);
                }
            });

            var LogPanelHeader = React.createClass({
                getDefaultProps: function () {
                    return {
                        header: 'Header',
                        logCollapsed: false
                    };
                },
                render: function () {
                    var icon = this.props.logCollapsed ? React.DOM.span({className: 'glyphicon glyphicon-plus'})
                        : React.DOM.span({className: 'glyphicon glyphicon-minus'});

                    return React.DOM.div({
                            className: 'panel-heading'
                        },
                        React.DOM.h5({
                            className: 'panel-title',
                            style: {
                                display: 'inline'
                            }
                        }, this.props.header),
                        React.DOM.button({
                            type: "button",
                            className: "btn btn-default btn-xs pull-right",
                            onClick: this.props.toggleCollapsed
                        }, icon)
                    );
                }
            });

            var LogPanel = React.createClass({
                getInitialState: function () {
                    return {
                        logCollapsed: false
                    };
                },
                toggleCollapsed: function(){
                    this.setState({
                        logCollapsed: !this.state.logCollapsed
                    });
                },
                render: function () {
                    return React.DOM.div({
                            className: 'form-group panel panel-default'
                        },
                        LogPanelHeader({
                            header:'Log',
                            logCollapsed: this.state.logCollapsed,
                            toggleCollapsed: this.toggleCollapsed
                        }),
                        LogList({
                            logEntries: this.props.logEntries,
                            logCollapsed: this.state.logCollapsed,
                            toggleCollapsed: this.toggleCollapsed
                        }));
                }
            });

            scope.$watchCollection('logEntries', function (n, o) {
                React.renderComponent(LogPanel({
                    logEntries: scope.logEntries
                }), element[0]);
            });
        }
    };
});