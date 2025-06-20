require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Record = require('./model/phonebook')


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, ) => {
  return req.body ? JSON.stringify(req.body) : ''
})

app.use(cors())

// Middleware to parse JSON bodies
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // Middleware for logging HTTP requests

app.get('/api/persons', (req, res, next) => {
  Record.find()
    .then(phonebook => res.json(phonebook))
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  const currentDate = new Date()
  Record.find()
    .then(phonebook => res.json(`Phonebook has info for ${phonebook.length} people
                ${currentDate.toDateString()} ${currentDate.toTimeString()}`))
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params['id']

  Record.findById(id)
    .then(record => {
      if (record) {
        res.json(record)
      } else {
        res.status(404).json(`Not record found for id: ${id}`)
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const idToDelete = req.params['id']

  Record.findByIdAndDelete(idToDelete)
    .then(deleted => {
      res.json(deleted)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  Record.findOne({ name: body.name })
    .then(record => {
      if (record) {
        res.status(400).json({ error: 'Contact already exists.' })
      } else {
        const newRecord = new Record({
          ...body
        })
        newRecord.save()
          .then(recordSaved => res.json(recordSaved))
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params['id']
  Record.findByIdAndUpdate(id, { name: body.name, number: body.number })
    .then(record => {
      if (record) {
        res.status(200).json(record)
      } else {
        res.status(404).json('No record to update.')
      }
    })
    .catch(err => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else {
    return response.status(500).send({ error: error.message })
  }
  next(err)
}

app.use(errorHandler)