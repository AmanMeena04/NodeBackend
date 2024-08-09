const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    service: 'gmail',
    port:process.env.PORT || 465,
    secure:true,
    logger:true,
    debug:true,
    secureConnection:true,
    auth: {
        user: process.env.USER ||'meena.aman4747@gmail.com',
        pass: process.env.PASS
    },
    tls:{
        rejectUnauthorized:true
    }
});

// Define email options
const mailSend = async(to, subject, content)=>{
    try{
    let mailOptions = {
        from: process.env.USER,
        to: to,
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.messageId);
            return info;
        }
    });
    }
    catch(error){
        console.log(error.message);
    }

}

module.exports = {mailSend};