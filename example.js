const anydo = require('./')

const options = {
  email: 'your@example.org',
  password: 'super-secret'
}

anydo(options, (err, result) => {
  if (err) throw err

  const taskTitles = result.models.task.items.map(t => t.title)
  console.log(taskTitles)
})
