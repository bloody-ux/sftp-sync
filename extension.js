// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Deploy = require('./src/deploy');

var deploy;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    deploy = new Deploy();
    var reload = vscode.workspace.onDidChangeConfiguration(deploy.reloadCfg);
    var save = vscode.workspace.onDidSaveTextDocument(deploy.syncToRemote);

    context.subscriptions.push(reload);
    context.subscriptions.push(save);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    if (deploy) {
        deploy.deactivate();
    }
}
exports.deactivate = deactivate;