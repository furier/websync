# **websync**

*websync is intended to be an **rsync task manager**, where rsync tasks can be added, scheduled and maintained in a sane manner.*

## Installation

- [OS X](https://github.com/furier/websync/wiki/Installation---OS-X)
- [Ubuntu](https://github.com/furier/websync/wiki/Installation---Ubuntu)

## Screenshots

![Tasks](https://www.dropbox.com/s/fjcpshfrmzzeriq/Screenshot%202014-08-08%2016.34.36.png)
![Hosts](https://www.dropbox.com/s/5668u1l04vwphjr/Screenshot%202014-08-08%2016.38.16.png)

## Features

- Tasks
  - Create
  - Edit
  - Remove
  - Schedule
  - multiple paths defined for one task.
  - Either source or destination can be a remote target, as long as a passwordless ssh RSA key (for the host running websync) has been added to authorized hosts on the remote target
  
- Hosts
  - Create
  - Edit
  - Remove

## Roadmap

- **File Browser**, which can browse both localhost and remote targets.
- **Path autocompletion** for both localhost and remote targets when just typing the paths manually in the path list for each task.
- **ssh-copy-id** to remote targets through the web interface on the hosts tab.

## Contact

- Authors
  - Sander Struijk - sander.struijk@gmail.com
  
## LICENSE - MIT
