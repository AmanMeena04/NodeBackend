const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const secretKey = config.secretKey;

// Verify User:
function authenticateToken(req, res, next) {

    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const cookies = req.headers.cookie;
    // const token = cookies.split('=')[1];
    console.log(req.headers.cookie,'AAAAAAAAAAAA',  req.headers);

    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
};

module.exports = {authenticateToken};