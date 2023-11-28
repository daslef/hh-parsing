const http = require('http')
const express = require('express')
const { translitRusEng } = require('./translit.cjs')

const app = express()
app.use(express.json())

app.post('/positions', async (req, res) => {
  const data = req.body
  const position = translitRusEng(data.position)

  import('./parsing/parse.mjs')
    .then(async parsing => {
      res.json({
        "resumes": await parsing.default(position)
      })
    })

  // import('./mock.mjs')
  //   .then(parsing => {
  //     res.json({
  //       "resumes": parsing.mock_resumes
  //     })
  //   })

})

const server = http.createServer(app)
const timeout = 20 * 60 * 1000

server.setTimeout(timeout)
server.keepAliveTimeout = timeout
server.headersTimeout = timeout

server.listen(3000)
