websync
=======

websync is intended to be an rsync manager, where rsync tasks can be added, scheduled and maintained in a sane manner.

Requirements
============

- Node
- NPM
- Bower
- Grunt

Installation
============

    git clone https://github.com/furier/websync.git
    npm install
    bower install
    
Rename the following file `tasks.json.default` to `tasks.json`

Development
-----------

    grunt serve

`grunt serve` will start up the node server and open your default browser at `http://localhost:9000` with live reload.

Production
----------

    grunt

`grunt` will build the project and create a `dist` folder which is ready for distribution.