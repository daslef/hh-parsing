const express = require('express')
const { translitRusEng } = require('./translit.cjs')

const app = express()

app.use(express.json())

app.post('/positions', async (req, res) => {
  const data = req.body
  const position = translitRusEng(data.position)

  import('./parsing.mjs')
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

app.listen(3000, () => {
  console.log(`App listening on 3000`)
})