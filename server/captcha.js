let captchaes = require('node-captcha-generator');
var c = new captchaes({
    length:5, // number length
    size:{    // output size
        width: 450,
        height: 200
    }
});
c.save('./img', function(err){
 
});

c.toBase64(function(err, base64){
 
});

c.captcha.write('./genimage', function(err){
});

console.log('GGGGGGGGGGG', c.value);