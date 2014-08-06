# **websync**

*websync is intended to be an rsync task manager, where rsync tasks can be added, scheduled and maintained in a sane manner.*

## Requirements

### General
- Git
    - OS X:     [`brew`][1]`install git`
    - Ubuntu:   `sudo apt-get install git`
- Node.js     
    - OS X:     [`brew`][1]`install node`
    - Ubuntu:   `sudo apt-get install nodejs`

### websync
- OS X
    - ssh-copy-id `brew install ssh-copy-id`
- *
    - sshpass
        - OS X: `brew install https://raw.github.com/eugeneoden/homebrew/eca9de1/Library/Formula/sshpass.rb`
        - Ubuntu: `sudo apt-get install sshpass`

> websync connects to remote targets via *ssh* by specifying *ssh* with the rsync shell flag.
> Connecting to remote targets without being prompted for a password,
> requires the public key of a **RSA key** pair to be present on the remote target.
> That can easily be achieved by using the `ssh-copy-id` command. e.g. `ssh-copy-id <username>@<host>`

#### Quick pre req install:

- OS X: `brew install git && brew install node && brew install ssh-copy-id && brew install https://raw.github.com/eugeneoden/homebrew/eca9de1/Library/Formula/sshpass.rb`
- Ubuntu: `sudo apt-get install -y git, nodejs, sshpass`

## Installation

    git clone https://github.com/furier/websync.git
    npm install

### Development

    gulp

`gulp` will start up the node server and run at `http://localhost:3000` with live reload.

### Production

    gulp dist

`gulp dist` will build the project and create a `dist` folder which is ready for distribution.

  [1]: http://brew.sh/