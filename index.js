const https = require('https')
const schema = require('./schema')

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

const login = ({ hostname, email, password }, callback) => {
  request({
    hostname,
    path: '/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email, password }
  }, callback)
}

const sync = ({ hostname, updatedSince, includeDone, includeDeleted }, auth, callback) => {
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

module.exports = (options = {}, callback = () => {}) => {
  if (!options.email) throw new Error('Missing email option')
  if (!options.password) throw new Error('Missing password option')

  const defaultOptions = {
    hostname: 'sm-prod2.any.do',
    updatedSince: 0,
    includeDone: false,
    includeDeleted: false
  }

  const anydoOptions = Object.assign(defaultOptions, options)

  login(anydoOptions, (err, res) => {
    if (err) return callback(err)

    const auth = res.headers['x-anydo-auth']
    if (!auth) return callback(new Error('No auth token found'))

    sync(anydoOptions, auth, (err, res) => {
      if (err) return callback(err)

      parseBody(res, callback)
    })
  })
}
