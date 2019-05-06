import express from 'express'

export const app = express()

app.get('/', (req, res, next) => {
  res.json('Welcome to Awesome Node Boilerplate')
})

export const start = () => {
  try {
    app.listen(3000, () => {
      console.log(`REST API on http://localhost:3000`)
    })
  } catch (e) {
    console.error(e)
  }
}