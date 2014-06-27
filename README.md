websync
=======

websync is intended to be an rsync manager, where rsync tasks can be added, scheduled and maintained in a sane manner.

Requirements
============

- Node     `brew install node`
- Bower    `npm install bower`
- Grunt    `npm install grunt`

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

The MIT License (MIT)
=============

Copyright (c) 2013 Sander Struijk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
