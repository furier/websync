/**
 * Created by sander.struijk on 09.07.14.
 */
'use strict';

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function (toolkit) {

    var isBlank = function (path) {
        if (!path) return true;

        return !(path.source !== '' || path.destination !== '');
    };

    var isFirst = function (paths, path) {
        if (!paths || !path) return false;

        return paths.indexOf(path) === 0;
    };

    var isLast = function (paths, path) {
        if (!paths || !path) return false;

        return paths.indexOf(path) === paths.length - 1;
    };

    var nextPath = function (paths, path) {
        if (isLast(paths, path)) return null;

        var index = paths.indexOf(path);
        return paths[index + 1];
    };

    var prevPath = function (paths, path) {
        if (isFirst(paths, path)) return null;

        var index = paths.indexOf(path);
        return paths[index - 1];
    };

    var getAllPrevBlankPaths = function (paths, path) {
        if (!paths || !path || paths.length < 2) return [];

        var blankPaths = [];

        function _getPrevBlankPath(path) {
            if (path && isBlank(path)) {
                blankPaths.push(path);
                _getPrevBlankPath(prevPath(paths, path));
            }
        }

        _getPrevBlankPath(prevPath(paths, path));
        return blankPaths;
    };

    var getAllNextBlankPaths = function (paths, path) {
        if (!paths || !path || paths.length < 2) return [];

        var blankPaths = [];

        function _getNextBlankPath(path) {
            if (path && isBlank(path)) {
                blankPaths.push(path);
                _getNextBlankPath(nextPath(paths, path));
            }
        }

        _getNextBlankPath(nextPath(paths, path));
        return blankPaths;
    };

    var createPath = function (source, destination) {
        return {
            id: toolkit.guid(),
            source: source || '',
            destination: destination || ''
        };
    };

    return {
        isBlank: isBlank,
        isFirst: isFirst,
        isLast: isLast,
        isFirstBlank: function (paths) {
            if (paths.length === 0) return false;

            var firstPath = paths[0];
            return isBlank(firstPath);
        },
        isLastBlank: function (paths) {
            if (paths.length === 0) return false;

            var lastPath = paths[paths.length - 1];
            return isBlank(lastPath);
        },
        nextPath: nextPath,
        prevPath: prevPath,
        isPrevPathBlank: function (paths, path) {
            if (!paths || !path || paths.length < 2) return false;

            var prevPath = prevPath(paths, path);
            if (!prevPath) return false;
            return isBlank(prevPath);
        },
        isNextPathBlank: function (paths, path) {
            if (!paths || !path || paths.length < 2) return false;

            var nextPath = nextPath(paths, path);
            if (!nextPath) return false;
            return isBlank(nextPath);
        },
        getAllPrevBlankPaths: getAllPrevBlankPaths,
        getAllNextBlankPaths: getAllNextBlankPaths,
        evalPaths: function (paths, path) {
            if (!paths) return [];

            function _evalPath(path) {
                if (paths.length === 1) {
                    if (!isBlank(path))
                        paths.push(createPath());
                }
                else if (isFirst(paths, path)) {
                    if (isBlank(path)) {
                        var blankSiblings = getAllNextBlankPaths(paths, path);
                        paths = _.xor(paths, blankSiblings);
                    }
                }
                else if (isLast(paths, path)) {
                    if (isBlank(path)) {
                        var blankSiblings = getAllPrevBlankPaths(paths, path);
                        paths = _.xor(paths, blankSiblings);
                    } else {
                        paths.push(createPath());
                    }
                }
                else if (isBlank(path)) {
                    var blankSiblings = getAllNextBlankPaths(paths, path);
                    var lastBlankSibling = _.last(blankSiblings);
                    if (lastBlankSibling && paths.indexOf(lastBlankSibling) === paths.length - 1){
                        paths = _.xor(paths, blankSiblings);
                        blankSiblings = getAllPrevBlankPaths(paths, path);
                        paths = _.xor(paths, blankSiblings);
                    }
                }
            }

            if (path)
                _evalPath(path);
            else
                _.forEach(paths, _evalPath);

            return paths;
        },
        createPath: createPath
    };
};