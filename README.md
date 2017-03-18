# anydo

**Unofficial Anydo client for Node.js.**

## Installation

```
npm install anydo
```

## Quickstart

```js
const anydo = require('anydo')

const options = {
  email: 'your@example.org',
  password: 'super-secret'
}

anydo(options, (err, result) => {
  if (err) throw err
  
  // get the titles of all your tasks
  const taskTitles = result.models.task.items.map(t => t.title)
  console.log(taskTitles) // => [ 'dont worry', 'be happy', ... ]
})
```

## API

### `anydo(options, callback)`

- **options** `<Object>`:
  - **email** `<String>`: *required*
  - **password** `<String>`: *required*
  - **hostname** `<String>`: default: `sm-prod2.any.do`
  - **updatedSince** `<Number>`: default: `0`
  - **includeDone** `<Boolean>`: default: `false`
  - **includeDeleted** `<Boolean>`: default: `false`

## License

[WTFPL](http://www.wtfpl.net/) – Do What the F*ck You Want to Public License.

Made with :heart: by [@MarkTiedemann](https://twitter.com/MarkTiedemannDE).