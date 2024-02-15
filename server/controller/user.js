const user = require('../mysql.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const pdf = require('../pdf/genpdf.js');
const excel = require('../excel/genexcel.js');
const multer = require('multer');
const auth = require('../controller/auth.js');
const express = require('express');
const app = express();
const path = require('path');

const reactBuildDir = "reactjs/build";
const uploadDir = "uploads";

app.use("/" + uploadDir, express.static(uploadDir));
app.use(express.static(path.join(__dirname, "../" + reactBuildDir)));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir + "/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


app.use(upload.single('file'));

// User Login:
router.post('/login', async(req, res) => {

    const { email, password } = req.body;
    
    const data = {
        email:email,
        password:password
    };
    try{
        const user_data = await user.login(data);

        if(user_data.token) {
            res.setHeader('Authorization', `Bearer ${user_data.token}`);
            return res.status(200).json({ message: 'Login successful', token: user_data.token });
        };
      }
      catch(err) {
        return res.send(err.message);
      }
});

// Read All Users:
router.get('/read', async(req,res)=> {
    
    const data = await user.read(); 
    res.send(data);
});

// Read Single User:
router.get('/read/:id', auth.authenticateToken, async (req, res) => {
    const data = await user.readOne(req.user.id);

    return res.send(data);
});

// User Register:
router.post('/register', upload.single('file'), async(req, res) => {
    
    const { username, email, password} = req.body;

    if(!username || !email|| !password) {
        return res.send('Please Fill all Field');
    }
    if(!req.file){
        return res.send('Please upload file!');
    }
    if(password.length < 8) {
        return res.send('Password Should be 8 or more than 8');
    }
    let data = {
        username:username,
        email:email,
        password:password
    }

    if(req.file.mimetype=='application/pdf'){
        data.pdf= uploadDir + "/" + req.file.filename.replace(/\\/g, path.sep);
    }
    else if(req.file.mimetype=='image/jpg' || req.file.mimetype== 'image/jpeg' || req.file.mimetype == "image/png"){
        data.image =
        uploadDir + "/" + req.file.filename.replace(/\\/g, path.sep);
    };

    try {
        await user.register(data).then((data)=>{
            return res.send(user_data);
        });

    }
    catch(err) {
        return res.send(err.message);
    }
});

// Update User:
router.put('/update/:id', auth.authenticateToken, async (req, res) => {

    const data = {};

    if(!req.body.email){
        return res.send("Please fill or Email");
    };

    if(req.body.username){
        data.username = req.body.username
    }
    if(req.body.email){
        data.email = req.body.email
    }
    if(req.body.password) {
        data.password = req.body.password || null;
    }
    try {
    const user_data = await user.update(data, req.user.id);
    return res.send(user_data);
    }
    catch(err) {
        return res.send(err.message);
    }
});

// Delete User:
router.delete('/delete/:id', auth.authenticateToken, async (req, res) => {
    const delUser = await user.deleteUser(req.params.id);
    return res.send(delUser);
});

// Logout User:
router.get('/logout', auth.authenticateToken, (req, res) => {

    const authHeader = req.headers["authorization"];

    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {

    if (logout) {
    return res.send({msg : 'You have been Logged Out' });
    } 
    else {
    return res.send({msg:'Error'});
    }
    });

});

// Genrate PDF With All User Data:
router.get('/generatepdf', auth.authenticateToken, async(req, res)=> {

    const genPDF = await user.genratePDF();
    pdf.genratePDF(genPDF);

    return res.send(genPDF);
});

// Generate Excel of Single User:
router.get('/genexcel/:id', auth.authenticateToken, async(req, res)=> {

    const id = req.params.id;
    const genExel = await user.genrateExel(id);

    excel.genExcel(genExel);

    return res.send(genExel);
});

module.exports = router;