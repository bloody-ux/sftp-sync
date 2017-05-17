
const util = require('./helpers');
const client = require('./sftp-client');

class Deploy {
  constructor() {
    this.config = {};

    this.reloadCfg = this.reloadCfg.bind(this);
    this.syncToRemote = this.syncToRemote.bind(this);
    this.isConfigValid = this.isConfigValid.bind(this);

    this.reloadCfg();
  }

  reloadCfg() {
    util.channel.clear();
    this.config = util.loadCfg()
    util.channel.appendLine('Now trying to load configuration from workspace settings.');
    return this.isConfigValid(true);
  }

  isConfigValid(showMsg = false) {
    const { local, remotes } = this.config;
    if (typeof local !== 'object'
      || !(remotes instanceof Array)) {
      showMsg &&
      util.channel.appendLine('  error: both [local] and [remotes] for sftp-sync should be set on workspace settings.')
      return false;
    }

    const { files } = local;

    if (!(files instanceof Array)) {
      showMsg &&
      util.channel.appendLine('  error: [files] config is invalid, should be an array');
      return false;
    }

    if (!remotes.length) {
      util.channel.appendLine('  error: at lease one item should be included in [remotes]');
      return false;
    }

    let validRemotes = true;
    remotes.forEach((item) => {
      const { root, username, host, port} = item;

      // can use empty password
      if (!root || !username
        || !host || !port) {
          showMsg &&
          util.channel.appendLine('  error: [remotes] config should have [host], [username], [port], [root] included');
          validRemotes = false;
        }
    });

    if (validRemotes && showMsg) {
      util.writeCfgToChannel(this.config);
    }
    
    return validRemotes;
  }

  syncToRemote({ fileName }) {
    if(!this.isConfigValid()) return;

    // 如果没有开启保存同步
    if(!this.config.local.syncOnSave) return;

    if(!util.matchFiles(fileName, this.config)) return;

    client.syncToServer(fileName, this.config);
  }

  deactivate() {
    util.channel.dispose();
  }
}

module.exports =  Deploy;