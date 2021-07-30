const Client = require('ssh2-sftp-client');
const path = require('path');
const vscode = require('vscode');
const Moment = require('moment');
const util = require('./helpers');
const channel = util.channel;

exports.syncToServer = function(filePath, config) {
  const localRoot = config.local.root || vscode.workspace.rootPath;
  const targets = config.remotes || [];
  const relativePath = filePath.replace(localRoot, '');

  targets.forEach((target) => {
    const remoteRoot = target.root;
    const remotePath = path.join(remoteRoot,relativePath)
    const remoteDir = path.dirname(remotePath);

    const sftp = new Client();
    sftp.connect(target)
    .then(() => sftp.mkdir(remoteDir, true)) // insure the directory exists
    .then(() => sftp.put(filePath, remotePath)) // upload file to remote
    .then(() => {
      sftp.end();

      const now = Moment();
      vscode.window.showInformationMessage(`succeed to sync ${relativePath} to ${target.host}:${remotePath}`);
      
      channel.appendLine(`${now.format('YYYY-MM-DD HH:mm:ss')} -> uploaded file: `);
      channel.appendLine(`    host: ${target.host}`);
      channel.appendLine(`    local: ${filePath}`);
      channel.appendLine(`    remote: ${remotePath}`);
      channel.appendLine('');
    })
    .catch((err) => {
      sftp.end();
      
      vscode.window.showErrorMessage('fail to sync file to ${target.host}, please see the detail in output');
      channel.appendLine(err);
      channel.show();
    })
  });
}
