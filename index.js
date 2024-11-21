const express = require('express');
const app = express();
const morgan = require('morgan')

// Middlewares
app.use(express.json());

app.use(morgan((tokens, req, res) => {
  return [
    'Method:', tokens.method(req, res), 
    'Status', tokens.status(req, res),
    '\nPath:  ', tokens.url(req, res),
    '\nBody:  ', JSON.stringify(req.body) || '{}',
    '\n---'
  ].join(' ');
}));

morgan.token('body', (req) => {
  return req.body && Object.keys(req.body).length > 0
    ? JSON.stringify(req.body)
    : 'No body';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


// const requestLogger = (request, response, next) => {
//   console.log('--- Request Logger ---');
//   console.log('Method:', request.method);
//   console.log('Path:  ', request.path);
//   console.log('Body:  ', request.body);
//   console.log('----------------------');
//   next(); // Continuar con el siguiente middleware o ruta
// };

// app.use(requestLogger);

// Base de datos 
let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
];

// Generador de ID
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0;
  return String(maxId + 1);
};

// Crear una nueva persona
app.post('/api/persons', (request, response) => {
  const body = request.body;

  // Validaciones
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

// Obtener una persona por ID
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Obtener todas las personas
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

// Información general
app.get('/info', (request, response) => {
  const numberOfEntries = persons.length;
  const currentTime = new Date();

  const responseContent = `
    <p>Phonebook has info for ${numberOfEntries} people</p>
    <p>${currentTime}</p>
  `;

  response.send(responseContent);
});

// Eliminar una persona por ID
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
