var fs = require('fs');
var path = require('path');

function directoryTree(basepath, extensions, recursive) {

    function _matchExtensions(extensions, name) {
        return extensions &&
               extensions.length > 0 &&
               extensions.indexOf(path.extname(name).toLowerCase()) == -1;
    }

    function _setFileDetails(item, name, extensions){
        if (_matchExtensions(extensions, name))
            return null;
        item.type = 'file';
    }

    function _setDirectoryDetails(item, name, recursive, extensions) {
        item.type = 'directory';
        item.children = fs.readdirSync(name).map(function (child) {
            var childPath = path.join(name, child);
            if (recursive)
                return _directoryTree(childPath, extensions, recursive);
            return {
                path: childPath,
                text: child,
                type: fs.statSync(childPath).isFile() ? 'file' : 'directory'
            };
        }).filter(function (e) {
            return e != null;
        });
    }

    var _directoryTree = function (name, extensions, recursive) {
        var stats = fs.statSync(name);
        var item = {
            path: name,
            text: path.basename(name)
        };

        if (stats.isFile()) {
            _setFileDetails(item, name, extensions);
        } else {
            _setDirectoryDetails(item, name, recursive, extensions);
            if (item.children.length == 0) {
                return null;
            }
        }

        return item;
    }

    return _directoryTree(basepath, extensions, recursive);
}

exports.directoryTree = directoryTree;

