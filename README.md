# sftp-sync

sftp-sync is a vscode extension used to sync local folder/files to remote machines.

## Features

Edit local files and save the change, the change will be uploaded to remote servers.

Logs are available in sftp-sync channel of OUTPUT.

## Extension Settings

This extension contributes the following settings:

* `sftp-sync.local`: local settings include what files to monitor and how to trigger synchronization.
* `sftp-sync.remotes`: remote machines include sftp connection settings and remote root.

### Typical Settings

``` json
"sftp-sync": {
    "local": {
      "files": [
        "**/*.js"
      ],
      "syncOnSave": true
    },
    "remotes": [
      {
        "host": "remote.server.name",
        "username": "user",
        "port": 22,
        "password": "pass",
        "root": "/home/user/"
      }
    ]
  }
```

## Release Notes

### 0.0.1

First release only support sync local resources to remotes when saving the file.


**Enjoy!**