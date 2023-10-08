const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config/config.json');

const secretKey = config.secretKey;

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// Mysql Connection:
connection.connect((err) => {
if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
}

connection.query('CREATE DATABASE IF NOT EXISTS userdb', function (err, result) {
  if (err) throw err;

  console.log("Database created");

connection.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, image VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)", function (err, result) {
  if (err) throw err;
  console.log(" Customer Table created");
});

});

console.log('Connected to MySQL');
});

// File Upload Function:
function upload(user, info) {

    return new Promise((resolve, reject) => {
    
        connection.query(`SELECT * FROM users WHERE id=${info.id}`, (err, results) => {
            if (err) {
              console.error('Error retrieving user into database:', err);
              return res.sendStatus(500);
            }
            const data = {
              image:user.image,
            }
            connection.query(`UPDATE users SET ? WHERE id = ${info.id}`,[data],(err,results)=> {
              if(err) console.error('Error update user image:', err);
            });
            resolve({ message: 'File uploaded successfully.',results:results });
          });
    });
}

// User Register Function:

function register(user) {

    return new Promise((resolve, reject) => {
        // Check if the username is already taken
    connection.query('SELECT * FROM users WHERE username = ?', [user.username], (err, results) => {
        if (err) {

          console.error('Error querying database:', err);
          return reject(500);
        }
        if (results.length > 0) {
          return reject({ message: 'Username already taken' });
        }

        // Generate a salt and hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            // Store the user in the database
            connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [user.username, user.email, hash], (err) => {
              if (err) {
                console.error('Error inserting user into database:', err);
                return reject(500);
              }
    
              resolve({ message: 'User registered successfully' });
            });
          });
        });
      });
    });
}

// User Login Function:

function login(userData) {

  return new Promise((resolve, reject) => {

    connection.query('SELECT * FROM users WHERE email = ?', [userData.email], (err, results) => {

      if (err) {
        console.error('Error querying database:', err);
        reject(500);
      }

      const user = results[0];
      
      // Check if the user exists
      if (results.length == 0) {
      //   return res.status(401).json({ message: 'Invalid email or password' });
        reject({ message: 'Invalid email' });
      }
      else {

        bcrypt.compare(userData.password, user.password, (err, result) => {
            if (result) {
                // Generate a JWT token
                const token = jwt.sign({email:userData.email, id:user.id}, secretKey);

                resolve({ message: 'Login successful' ,token:token});
              } else {
              // return res.status(401).json({ message: 'Invalid email or password' });
                reject({ message: 'Invalid password' });
              }
            });
      }
      })
    })

}

// Users Read Function:

function read() {

    return new Promise((resolve, reject) => {

        connection.query('SELECT * FROM users', (err, results) => {
            if (err) {
              console.error('Error inserting user into database:', err);
              reject(500);
            }

            resolve(results);
          });
    });
}

// Single User Read Function:

function readOne(id) {

    return new Promise((resolve, reject) => {

        connection.query(`SELECT * FROM users WHERE id=${id}`, (err, results) => {
            if (err) {
              console.error('Error Getting user Data:', err);
              reject(500);
            }
            resolve(results);
          });
    });
}

// User Update Function:

function update(data, id) {

    return new Promise((resolve, reject) => {
        
        connection.query(`SELECT * FROM users WHERE id=${id}`, (err, results) => {
            if (err) {
              console.error('Error inserting user into database:', err);
              reject(500);
            }
            const [user_data] = results;

           if(user_data) {
            if(data.password) {

              bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(data.password, salt, (err, hash) => {
                   
                    let info = {
                      password:hash,
                      username:data.username
                    }
                    connection.query(`UPDATE users SET ? WHERE id = ?`,[info, id], (err) => {
                      if (err) {
                        console.error('Error updating user into database:', err);
                        reject(500);
                      }
            
                      resolve({ message: 'User update successfully' });
                    });
                  });
              });
            }
            else{

              let info = {
                username:data.username,
                email:data.email
              }
              connection.query(`UPDATE users SET ? WHERE id = ?`,[info, id], (err) => {
                if (err) {
                  console.error('Error updating user into database:', err);
                  reject(500);
                }
      
                resolve({ message: 'User update successfully' });
              });
            }

           }
           else{
            reject('Record not Exist to Update');
           }
          });
    });
}

// User Delete Function:

function deleteUser(id) {

    return new Promise((resolve,reject)=> {

        connection.query(`DELETE FROM users WHERE id=${id}`, (err, result)=> {
            if(err) reject(err);
            else 
                resolve(result);
        })
    })
}

// PDF Generate Function:

function genratePDF() {
    return new Promise((resolve, reject)=> {
      connection.query('SELECT * FROM users', (err, result)=> {
        if(err) reject(err);
        else resolve(result);
      })
    })
}

// Excel Generate Function:

function genrateExel(id) {
  return new Promise((resolve, reject)=> {
    connection.query(`SELECT * FROM users WHERE id=${id}`, (err, result)=> {
      if(err) reject(err);
      else resolve(result);
    })
  })
}

module.exports = {register, login, read, readOne, update, deleteUser, upload, genratePDF, genrateExel};