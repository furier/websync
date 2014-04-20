/**
 * Created by furier on 20/04/14.
 */
'use strict';
var fs = require('fs'),
    path = require('path'),
    file = path.normalize(__dirname + '/../../assets/rsync.man');

module.exports = (function () {

    var flags = [];

    function Flag(name, short, tooltip) {
        return {
            name: name,
            short: short,
            tooltip: tooltip
        };
    }

    fs.readFile(file, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        //this one captures all flags in rsync.man
        //^(?:-([a-zA-Z0-9])|  )[ ,] (?:--([a-zA-Z0-9-]+(?:=[A-Z_]+)?))? +(.+)$

        var re = /^-(\w),?\s+--([\w-]+)\s+(.+)/gm;
        var str = data.toString(), m;

        while ((m = re.exec(str)) !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            flags.push(new Flag(m[2], m[1], m[3]));
        }

    });

    return {
        flags: function () {
            return flags;
        }
    };
}());