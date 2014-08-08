# **websync**

_websync is intended to be an **rsync task manager**, where rsync tasks can be added, scheduled and maintained in a sane manner._

## Installation

- [OS X](https://github.com/furier/websync/wiki/Installation---OS-X)
- [Ubuntu](https://github.com/furier/websync/wiki/Installation---Ubuntu)

## Screenshots

### Tasks tab
![Tasks](doc/screenshots/tasks_tab.png)

### Hosts tab
![Hosts](doc/screenshots/hosts_tab.png)

## Features

- All
  - Every change is auto synchronized with the back end, no manual saving is required!
  - Data is stored in a simple json file on disk!

- Tasks
  - Create
  - Edit
  - Remove
  - Clone
  - Schedule
  - Multiple paths defined for one task.
  - Either source or destination can be a remote target, as long as a passwordless ssh RSA key (for the host running websync) has been added to authorized hosts on the remote target

- Hosts
  - Create
  - Edit
  - Remove

## Roadmap

- **File Browser**, which can browse both localhost and remote targets.
- **Path autocompletion** for both localhost and remote targets when just typing the paths manually in the path list for each task.
- **ssh-copy-id** to remote targets through the web interface on the hosts tab.

## Collaborate

- Collaborators are very welcome, contact me!
- Pull requests are also welcome, fork me and send me a pull request!

## Contact

- Authors
  - Sander Struijk - sander.struijk@gmail.com

## LICENSE - MIT
