const express = require('express')

const app = express()

let counter = 0

app.use(express.static(__dirname + '/public'))
app.get('/counter', function(req, res) {
  console.log(req.method)

  res.json({value: counter})
})

app.post('/counter', function(req, res) {
  const increment = parseInt(req.query['increment'] || '1')

  counter += increment

  res.json({value: counter})
})

app.get('/foo', (req, res) => {
  const text = readFile('foo.html')

  res.send(text)
})

app.listen(process.env.PORT, () => console.log('listening...'))