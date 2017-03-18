const https = require('https')

module.exports = (options, callback) => {
  const req = https.request(options, res => {
    res.on('error', callback)
    if (res.statusCode !== 200) callback(new Error(res.statusCode))
    else callback(null, res)
  })
  req.on('error', callback)
  req.end(JSON.stringify(options.body))
}
