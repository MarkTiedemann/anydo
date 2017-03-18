const https = require('https')
const x = require('throw-if-missing')
const schema = require('./schema')
const noop = () => {}

const request = (options, callback) => {
  const req = https.request(options, res => {
    res.on('error', callback)
    if (res.statusCode !== 200) callback(new Error(res.statusCode))
    else callback(null, res)
  })
  req.on('error', callback)
  req.end(JSON.stringify(options.body))
}

const parseBody = (res, callback) => {
  const buffer = []
  res.on('data', data => buffer.push(data))
  res.on('end', () => {
    try {
      const body = Buffer.concat(buffer).toString()
      callback(null, JSON.parse(body))
    } catch (err) {
      callback(err)
    }
  })
}

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
