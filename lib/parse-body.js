module.exports = (res, callback) => {
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
