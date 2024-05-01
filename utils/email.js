const nodemailer  = require('nodemailer');

const sendEmail = async options=>{
  const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNMAE,
      pass:process.env.EMAIL_PASSWORD
    },
  });

  const mailOptions ={
     from:'kunal pawar <cyberInstant@gmail.com>',
     to:options.email,
     subject:options.subject,
     text:options.message
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});

}

module.exports = sendEmail;