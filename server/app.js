const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const users = require('./controller/user.js');
const config = require('./config/config.json');
const path = require('path');

const cors = require('cors');

app.use(cors());
const port = config.port || 4000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
  
// Router
app.use('/users', users);

// Create Server:
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})