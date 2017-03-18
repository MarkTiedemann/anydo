const x = require('throw-if-missing')
const schema = require('./schema')
const request = require('./lib/request')
const parseBody = require('./lib/parse-body')
const noop = () => {}

const login = ({
  hostname = 'sm-prod2.any.do',
  email = x`email`,
  password = x`password`
} = {}, callback = noop) => {
  request({
    hostname,
    path: '/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email, password }
  }, callback)
}

const sync = ({
  hostname = 'sm-prod2.any.do',
  updatedSince = 0,
  includeDone = false,
  includeDeleted = false,
  auth = x`auth`
} = {}, callback = noop) => {
  request({
    hostname,
    path: '/api/v2/me/sync?updatedSince=' + updatedSince,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Anydo-Auth': auth
    },
    body: { models: schema(includeDone, includeDeleted) }
  }, callback)
}

const anydo = (options = {}, callback = noop) => {
  login(options, (err, res) => {
    if (err) return callback(err)
    options.auth = res.headers['x-anydo-auth']

    sync(options, (err, res) => {
      if (err) return callback(err)
      parseBody(res, callback)
    })
  })
}

module.exports = anydo
module.exports.login = login
module.exports.sync = sync
