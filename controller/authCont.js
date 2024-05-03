const User = require('../models/userModel.js');
const {generateToken} = require('../utils/jwt.js');
const sendemail =  require('../utils/email.js');
const crypto = require('crypto')


exports.signup = async(req,res)=>{
    try{
    //const dataFile =  req.file.path;
     let data = req.body;
     //data.photo = dataFile;
     const newUser = new User(data);
     const response = await newUser.save();
      const payload = {
         id:response.id
      } 
      
      const token  = generateToken(payload);
       res.status(201).json({
       status:"success",
       token:token,
       response
       });

    }catch(err){
      console.log(err);
      res.status(500).json({
          error:"internal server Error"
       })
    }
}

exports.login = async(req,res)=>{
   try{
     const {email, password} = req.body;
     const user  = await User.findOne({email:email});

     // if email does not exist or pasword does not match , return error 
     if(!user || !(await user.comparePassword(password))){
       return res.status(400).json({
          status:"fail",
          error:"Invalid  email or password"
       })
     }
     
     const payload = {
       id:user.id
    } 
    
    const token  = generateToken(payload);
     res.status(201).json({
          status:"success",
          token:token
     })

   }catch(err){
       console.log(err);
      res.status(500).json({
       status:"fail",
       error:"Internal server error"
      })
   }
};


exports.getALlData = async(req,res)=>{
     try{
       const userData  = await User.find();

       req.status(200).json({
         userData
       })

     }catch(err){
      console.log(err);
      res.status(500).json({
       status:"fail",
       error:"Internal server error"
      })
     }
}


exports.forgotPassword = async(req,res)=>{
   const user  = await User.findOne({email:req.body.email})
   if(!user){
      return res.status(404).json({
         status:"fail",
         error:"there is no user with that email id"
      })
   }
   try{
      const resetToken  = user.createPasswordResetToken();
      await user.save({validateBeforeSave:false});
      
      const resetURL =  `${req.protocol}://${req.get('host')}/user/resetpassword/${resetToken}`;

      const message = `Forget your password? submit a PATCH request with your new password 
      passowrdconfirm  --${resetURL}.\n if you didt'n forget your passowrd , please ignore this message!`;

      await sendemail({
         email: user.email,
         subject: 'Your password reset token (valid for 10 min)',
         message
       });
      res.status(200).json({
         status:"success", 
      })
   }catch(err){
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({validateBeforeSave:false});
         console.log(err);
          res.status(500).json({
            status:"fail",
            error:"Internal server error"
         })
   }
};

exports.resetPassword = async(req,res)=>{
   try{
   const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
   if(!user){
      res.status(400).json({
         status:"fail",
         error:"Token is invalid or has expired"
      })
   }
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      const payload = {
         id:user.id
      } 
      const token  = generateToken(payload);
      res.status(200).json({
         status:"success",
         message:"done",
         token
      })
   }catch(err){
      console.log(err);
      res.status(500).json({
        status:"fail",
        error:"Internal server error"
     })
   }

};
