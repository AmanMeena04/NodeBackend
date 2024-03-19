const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const users = require('./controller/user.js');
const config = require('./config/config.json');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use('/uploads', express.static('uploads'));

require('dotenv').config();

const port = process.env.SERVER_PORT || 4000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
// Router
app.use('/users', users);
app.use(cookieParser);

// Create Server:
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});