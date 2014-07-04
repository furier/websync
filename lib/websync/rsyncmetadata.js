/**
 * Created by furier on 20/04/14.
 */
'use strict';
var fs = require('fs'),
    path = require('path'),
    flagsFile = path.normalize(__dirname + '/../../assets/rsync.flags'),
    errorCodesFile = path.normalize(__dirname + '/../../assets/rsync.errorcodes');

var flags = [];
var errorCodes = {};

function Flag(name, short, tooltip) {
    return {
        name: name,
        short: short,
        tooltip: tooltip
    };
}

function match(pattern, string) {
    var re = pattern;
    var str = string, m;
    var matches = [];
    while ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        matches.push(m);
    }
    return matches;
}

function readFile(file, pattern, callback) {
    fs.readFile(file, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        callback(match(pattern, data.toString()));
    });
}

readFile(flagsFile, /^-(\w),?\s+--([\w-]+)\s+(.+)/gm, function(matches) {
    matches.forEach(function (m) {
        flags.push(new Flag(m[2], m[1], m[3]));
    });
});

readFile(errorCodesFile, /^\s?(\d{1,2})\s+(.+)$/gm, function(matches) {
    matches.forEach(function (m) {
        errorCodes[m[1]] = m[2];
    });
});

module.exports = {
    flags: flags,
    getErrorCode: function(code) {
        return errorCodes[code];
    }
};