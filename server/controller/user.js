const user = require('../mysql.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const pdf = require('../pdf/genpdf.js');
const excel = require('../excel/genexcel.js');
const multer = require('multer');
const auth = require('../controller/auth.js');

// Upload File With Multer:

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// File Upload:
router.post('/file', auth.authenticateToken, upload.single('file'), async(req, res)=> {
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const data = {
        image:req.file.path,
    }

    const user_data = await user.upload(data, req.user);
    res.send(user_data);
});

// User Login:
router.post('/login', async(req, res) => {

    const { email, password } = req.body;
    const data = {
        email:email,
        password:password
    }
    try{
        const user_data = await user.login(data);

        if(user_data.token) {
            res.setHeader('Authorization', `Bearer ${user_data.token}`);
            return res.status(200).json({ message: 'Login successful', token: user_data.token });
        }
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
router.get('/read/:id', async (req, res) => {

    const id = req.params.id;
    const data = await user.readOne(id);

    res.send(data);
});

// User Register:
router.post('/register', async(req, res) => {

    const { username, email, password } = req.body;

    if(!username || !email|| !password) {
        res.send('Please Fill all Field')
    }
    
    if(password.length != 8) {
        res.send('Password Should be 8 or more than 8');
    }

    const data = {
        username:username,
        email:email,
        password:password
    }
    try {
        const user_data = await user.register(data);
        res.send(user_data);
    }
    catch(err) {
        return res.send(err.message);
    }
});

// Update User:
router.put('/update/:id', async (req, res) => {

    const data = {};

    if(req.body.username){
        data.username = req.body.username
    }
    if(req.body.username){
        data.email = req.body.email
    }
    if(req.body.username) {
        data.password = req.body.password
    }
    
   const user_data = await user.update(data, req.params.id);

   res.send(user_data);
});

// Delete User:
router.delete('/delete/:id', auth.authenticateToken, async (req, res) => {
    const delUser = await user.deleteUser(req.params.id);
    res.send(delUser);
});

// Logout User:
router.get('/logout', auth.authenticateToken, (req, res) => {

    const authHeader = req.headers["authorization"];

    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {

    if (logout) {
    res.send({msg : 'You have been Logged Out' });
    } 
    else {
    res.send({msg:'Error'});
    }
    });

});

// Genrate PDF With All User Data:
router.get('/generatepdf', auth.authenticateToken, async(req, res)=> {

    const genPDF = await user.genratePDF();
    pdf.genratePDF(genPDF);

    res.send(genPDF);
});

// Generate Excel of Single User:
router.get('/genexcel/:id', auth.authenticateToken, async(req, res)=> {

    const id = req.params.id;
    const genExel = await user.genrateExel(id);

    excel.genExcel(genExel);

    res.send(genExel);
});

module.exports = router;