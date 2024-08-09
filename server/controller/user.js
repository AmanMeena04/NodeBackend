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
const { mailSend } = require('../mail.js');

const reactBuildDir = "reactjs/build";

app.use(express.static(path.join(__dirname, "../" + reactBuildDir)));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads' + "/");
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
            res.cookie(String(user_data.id),user_data.token, {
                path:'/',
                expires: new Date(Date.now()+1000*30),
                httpOnly:true,
                sameSite:'lax'
            } );
            return res.sendStatus(200);
            // res.setHeader('Authorization', `Bearer ${user_data.token}`);
            // return res.status(200).json({ message: 'Login successful', token: user_data.token });
        };
      }
      catch(err) {
        return res.send(err.message);
      }
});

// Read All Users:
router.get('/read', async(req, res)=> {
    const data = await user.read();
    res.send(data);
});

// Read Single User:
router.get('/read/:id', async (req, res) => {
    const data = await user.readOne(req.params.id);
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
        data.pdf= 'uploads' + "/" + req.file.filename.replace(/\\/g, path.sep);
    }
    else if(req.file.mimetype=='image/jpg' || req.file.mimetype== 'image/jpeg' || req.file.mimetype == "image/png"){
        data.image =
        'uploads' + "/" + req.file.filename.replace(/\\/g, path.sep);
    };

    try {
        await user.register(data).then((data)=>{
            const mail = mailSend(data.userData.email, 'register mail', 'Register Successfully');
            return res.send(data);
        });

    }
    catch(err) {
        return res.send(err.message);
    }
});

// Update User:
router.put('/update/:id', async (req, res) => {
    const data = {};

    if(!req.body.email){
        return res.send("Please fill Email");
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
    const user_data = await user.update(data, req.params.id);
    return res.send(user_data);
    }
    catch(err) {
        return res.send(err.message);
    }
});

// Delete User:
router.delete('/delete/:id', async (req, res) => {
    const delUser = await user.deleteUser(req.params.id);
    return res.send(delUser);
});
;
// Logout User:
router.get('/logout', (req, res) => {

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

// User OTP Generate:
router.post('/generate-otp', async(req, res)=> {

    let userId = req.user.id;

    try{
        const otp = Math.floor(1000 + Math.random() * 9000);
        let userdata = await user.readOne(userId);

        if(!userdata) {
            // return res.send(400).status('Not valid user');
            return res.send('Not valid user');
        }
        
        let otpData = await user.createOtp(userdata[0].id, otp);
        
        let currentDate = new Date();
        let created = new Date(otpData[0].created_at);
        
        let diff = currentDate - created;
        let Min = Math.floor(diff/(1000*60));
        console.log('@@@@@@!!!!!!!!!++++++', Min);
        
        if(Min > 1) {
            // return res.status(400).send("Please Try again Later");
            return res.send("Please Try again Later");
        }
        else {
            await sendOtp(otp, userdata[0].email);
        }
    }
    catch(error) {
        return res.send('Error:',error);
    }
});

// User OTP Verification:
router.get('/verify-otp', async(req, res)=> {

    let {userId, otp, otpId} = req.body;

    if(!otp || !userId || !otpId) {
        // return res.send(400).status('Please fill all fields');
        return res.send('Please fill all fields');
    };
    
    try {
        let userInfo = await user.readOtp(otpId);

        if(userInfo[0].otp !== otp) {
            // return res.send(400).status('Please Enter Correct OTP');
            return res.send('Please Enter Correct OTP')
        }
        if(userInfo[0].is_verified == 0) {
            let userData = await user.Verified(userInfo[0].id);
    
            if(userData) {
                return res.send("User Verified")
                // res.send(200).status("User Verified");
            };
        }
        else {
            return res.send('User Already verified');
        };
    }
    catch(error) {
        // return res.send(400).status(error);
        return res.send(error);
    };
});

// User OTP Read:
router.get('/readOtp', (req, res)=> {
    let {otpId} = req.body;
    let value = user.readOtp(otpId);
    console.log(value);
});

// Send user OTP:
async function sendOtp(otp, email) {

    let content = `Your One time otp ${otp}`;
    return await mailSend(email, 'otp verification', content);
};

// Genrate PDF With All User Data:
router.get('/generatepdf', async(req, res)=> {

    const genPDF = await user.genratePDF();
    pdf.genratePDF(genPDF);

    return res.send(genPDF);
});

// Generate Excel of Single User:
router.get('/genexcel/:id', async(req, res)=> {

    const id = req.params.id;
    const genExel = await user.genrateExel(id);

    excel.genExcel(genExel);

    return res.send(genExel);
});

module.exports = router;