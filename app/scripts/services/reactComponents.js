/**
 * Created by sander.struijk on 25.06.14.
 */
'use strict';

var React = require('react');

module.exports = function () {

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
        componentWillUpdate: function () {
            var node = this.getDOMNode();
            this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
        },
        componentDidUpdate: function () {
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
        toggleCollapsed: function () {
            this.setState({
                logCollapsed: !this.state.logCollapsed
            });
        },
        render: function () {
            return React.DOM.div({
                    className: 'form-group panel panel-default'
                },
                LogPanelHeader({
                    header: this.props.header,
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

    return {
        LogEntry: LogEntry,
        LogList: LogList,
        LogPanelHeader: LogPanelHeader,
        LogPanel: LogPanel
    };
};