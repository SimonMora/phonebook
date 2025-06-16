const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static('dist'))
app.use(express.json());

morgan.token('body', (req, res) => { 
  return req.body ? JSON.stringify(req.body) : '' 
});

app.use(cors());

// Middleware to parse JSON bodies
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')); // Middleware for logging HTTP requests


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/api/persons", (req, res) => {
    res.json(phonebook);
});

app.get("/info", (req, res) => {
    const currentDate = new Date();
    res.json(`Phonebook has info for ${phonebook.length} people
                ${currentDate.toDateString()} ${currentDate.toTimeString()}`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params["id"];
    //console.log(id);
    
    const resp = phonebook.find(person => person.id === id.toString());
    if (resp) {
        return res.json(resp);
    } else {
        return res.status(404).json({ error: "Id not found" });
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const idToDelete = req.params["id"];
    const toDelete = phonebook.find(person => person.id === idToDelete.toString());

    if (toDelete) {
        phonebook = phonebook.filter(person => person.id !== idToDelete.toString());
        return res.json(toDelete);
    } else {
        return res.status(404).json({ error: "Id not found" });
    }
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const newRecord = {
        id: getRandomNumber(4).toString(),
        ...body
    };
    const exists = phonebook.find(record => record.name === newRecord.name);

    if (newRecord.name !== '' && newRecord.number !== '' && !exists) {
        phonebook = phonebook.concat(newRecord);
        return res.json(newRecord);
    } else {
        let error = '';
        if(exists) {
            error += 'Contact already exists. '
        } else {
            if (newRecord.name === '') {
                error += 'Name is required to create a new record. ';
            }

            if (newRecord.number === '') {
                error += 'Number is required to create a new record.';
            }
        }
        

        return res.status(400).json({ error: error });
    }
});

function getRandomNumber(digits) {
    const min = Math.pow(10, digits - 1); // Minimum n-digit number
    const max = Math.pow(10, digits) - 1; // Maximum n-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}