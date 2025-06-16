const mongoose = require('mongoose')
const URL = process.env.MONGO_DB_URL;

console.log(URL);

mongoose.set('strictQuery',false);
mongoose.connect(URL)
.then(result => console.log("Successfully connected to MongoDB"))
.catch(err => console.log(`Error, trying to connect to MongoDB: ${err}`));

const recordSchema = new mongoose.Schema({
  name: String,
  number: String,
});

recordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('phonebook', recordSchema);