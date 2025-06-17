const mongoose = require('mongoose')
const URL = process.env.MONGO_DB_URL

mongoose.set('strictQuery',false)
mongoose.connect(URL)
  .then( () => console.log('Successfully connected to MongoDB'))
  .catch(err => console.log(`Error, trying to connect to MongoDB: ${err}`))

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    required: [true, 'Name is a required value']
  },
  number: {
    type: String,
    minLength: [8, 'Number must be at least 8 characters'],
    validate: {
      validator: v => {
        return /\d{2,3}-\d/.test(v)
      },
      message: props => `${props.value} is not a valid phone number.`
    }
  },
})

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('phonebook', recordSchema)