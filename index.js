const connectToMongo = require('./db');
const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')

connectToMongo();

const app = express()
let server = require('http').Server(app);
const port = process.env.PORT || 5000

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

server.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`);
})