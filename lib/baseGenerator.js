const Generator = require('yeoman-generator')
const fs = require('fs')

module.exports = Generator.extend({
  constructor: function (args, opts) {
    Generator.call(this, args, opts)

    /*
     * _globalConfig points to ~/.yo-rc-global.json
     * when the user does not have permissions to write to
     * this file, write to the local config instead
     * to prevent yeoman from throwing an uncaught error
     */
    try {
      const cur = fs.readJSONSync(this._globalConfig.path)
      fs.writeJSONSync(this._globalConfig.path, cur)
    } catch (e) {
      this._globalConfig = this.config
    }
  }
})
