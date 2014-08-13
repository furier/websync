'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function (io) {

    function _getType(stats) {
        if (stats.isFile())
            return 'file';
        if (stats.isDirectory())
            return 'directory';
        return 'unknown';
    }

    function _getChildrenForPath(basePath, callback) {
        fs.readdir(basePath, function (err, files) {
            callback(err, _.map(files, function (file) {
                try {
                    var fileStats = fs.statSync(path.join(basePath, file));
                    return {
                        name: file,
                        type: _getType(fileStats)
                    };
                } catch (e) {
                }
                return {
                    name: file,
                    type: 'unknown'
                };
            }));
        });
    }

    io.on('connection', function (socket) {
        socket.on('path.getChildren', function (pathObj, callback) {

            if (!(_.endsWith(pathObj.name, '/')))
                pathObj.name = path.normalize(_.strLeftBack(pathObj.name, '/'));
            _getChildrenForPath(pathObj.name, callback);

        });
    });

};

