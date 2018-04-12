const BaseGenerator = require('../lib/baseGenerator')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const URL = require('whatwg-url').URL
const utils = require('../lib/utils')
const upperFirst = require('lodash.upperfirst')

module.exports = BaseGenerator.extend({
  constructor: function (args, opts) {
    BaseGenerator.call(this, args, opts)

    this.templatePath = utils.templatePath(path.join('.donejs', 'templates', 'supermodel'))

    this.props = {}

    this.argument('name', {
      type: String,
      required: false,
      desc: 'The name for the model (e.g. order)'
    })

    this.modelFiles = [
      'fixtures/model.js',
      'model.js',
      'model-test.js'
    ]
  },

  prompting: function () {
    const done = this.async()

    function addToProps (props) {
      this.props = _.extend(this.props, props)
    }

    this.prompt({
      name: 'name',
      type: String,
      validate: utils.validateRequired,
      message: 'The name for you model (e.g. order)',
      when: !this.options.name
    }).then(function (first) {
      const name = this.options.name = this.options.name || first.name

      const prompt = {
        name: 'url',
        message: 'What is the URL endpoint?',
        default: '/' + name
      }

      const promptId = function () {
        const prompt = {
          name: 'idProp',
          message: 'What is the property name of the id?',
          default: 'id'
        }

        return this.prompt(prompt).then(addToProps.bind(this)).then(function () {
          done()
        })
      }.bind(this)

      this.prompt(prompt).then(function (answer) {
        const rawUrl = answer.url.trim()
        try {
          const url = new URL(rawUrl)
          const urlPath = url.pathname
          url.pathname = ''
          const serviceBaseURL = utils.removeSlash(url.toString())

          const prompt = {
            name: 'useServiceBaseURL',
            message: 'Is ' + serviceBaseURL + ' your service URL?',
            type: Boolean
          }
          this.prompt(prompt).then(function (answer) {
            this.props.serviceBaseURL = answer.useServiceBaseURL &&
              serviceBaseURL
            this.props.url = answer.useServiceBaseURL ? urlPath : rawUrl

            return promptId()
          }.bind(this))
        } catch (ex) {
          this.props.url = answer.url
          return promptId()
        }
      }.bind(this))
    }.bind(this))
  },

  writing: function () {
    const self = this
    const done = this.async()
    _.mixin(require('lodash-inflection'))

    const pkg = utils.getPkgOrBail(this, done)
    if (!pkg) {
      return
    }

    const folder = _.get(pkg, 'steal.directories.lib') || './'

    if (this.props.serviceBaseURL) {
      pkg.steal.serviceBaseURL = this.props.serviceBaseURL
      const pkgPath = this.destinationPath('package.json')
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, ' '), 'utf8')
    }

    const options = {
      className: upperFirst(_.camelCase(this.options.name)),
      name: this.options.name,
      url: this.props.url,
      idProp: this.props.idProp
    }

    if (this.options.name === 'test') {
      throw new Error('Supermodel can not be named "test"')
    }

    this.modelFiles.forEach(function (name) {
      let target
      if (name === 'fixtures/model.js') {
        target = name.replace('model', _.pluralize(options.name))
      } else {
        target = name.replace('model', options.name)
      }
      self.fs.copyTpl(
        self.templatePath(name),
        self.destinationPath(path.join(folder, 'models', target)),
        options
      )
    })

    const modelTest = this.destinationPath(path.join(folder, 'models', 'test.js'))
    utils.addImport(modelTest, '~/models/' + options.name + '-test')
    const fixturesFile = this.destinationPath(path.join(folder, 'models', 'fixtures', 'fixtures.js'))
    utils.addImport(fixturesFile, '~/models/fixtures/' + _.pluralize(options.name))

    done()
  }
})
