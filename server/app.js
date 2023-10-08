const express = require('express');
const app = express();

const bodyparser = require('body-parser');
const users = require('./controller/user.js');
const config = require('./config/config.json');
const cors = require('cors');

app.use(cors());
const openai = require('./chatbot/chatbot.js')
// app.use(cors({ origin: 'http://127.0.0.1:5500' }))
// app.get('/data', (req, res) => {
//   res.json({
//     name: 'cors in node.js',
//     language: 'JavaScript',
//     server: 'Express.js',
//   })
// })

const port = config.port || 4000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
  
// Router
app.use('/users', users);

// Create Server:
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})