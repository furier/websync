var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function directoryTreeSync(basepath, extensions, recursive, maxDepth) {

    if (maxDepth)
        maxDepth++;

    function _matchExtensions(extensions, name) {
        return extensions &&
               extensions.length > 0 &&
               extensions.indexOf(path.extname(name).toLowerCase()) == -1;
    }

    function _processChildren(item, name, callback){
        try {
            item.children = fs.readdirSync(name).map(function (child) {
                return callback(child);
            }).filter(function (e) {
                return e != null;
            });
        } catch(e) {
            item.children = [];
        }
    }

    function _setType(stats){
        try {
            if (stats.isFile())
                return 'file';
            else if (stats.isDirectory())
                return 'directory';
        } catch(e) {
            if (e.errno === 34)
                return '';
        }
    }

    function _setVisible(name) {
        return name.indexOf('.') === -1;
    }

    function _createItem(fullPath) {
        var stats = fs.statSync(fullPath);
        var name = path.basename(fullPath);
        return {
            path: fullPath,
            text: name,
            type: _setType(stats),
            mode: stats.mode,
            visible: _setVisible(name)
        };
    }

    var _directoryTreeSync = function (name, extensions, recursive) {
        var item = _createItem(name);

        switch (item.type){
            case 'file' :
                if (_matchExtensions(extensions, name))
                    return null;
                return item;
            case 'directory' :
                if (maxDepth)
                    maxDepth--;
                if (recursive && (_.isUndefined(maxDepth) || maxDepth > 0)) {
                    _processChildren(item, name, function (child) {
                        return _directoryTreeSync(path.join(name, child), extensions, recursive);
                    })
                } else {
                    _processChildren(item, name, function (child) {
                        return _createItem(path.join(name, child));
                    });
                }
                if (item.children.length == 0)
                    return null;
                return item;
            default :
                return null;
        }
    };
    return _directoryTreeSync(basepath, extensions, recursive);
}

exports.directoryTreeSync = directoryTreeSync;

