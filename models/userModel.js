const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSc = new mongoose.Schema({
     userName:{
         type:String,
         required:true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide valid email']
     },
     photo: String,
     password:{
        type:String,
        required:true,

     },
     passwordResetToken:String,
     passwordResetExpires:Date
});

userSc.pre('save', async function(next) {
   const user = this;
   if(!user.isModified('password')){
     return next();
   }
   try{
     const salt  = await bcrypt.genSalt(9);

     const hashedPassword = await bcrypt.hash(user.password,salt);

     user.password = hashedPassword;
     next();
   }catch(err){
         return next(err)
   }
 
});

userSc.methods.comparePassword = async function(candidatePassword){
   try{
      const isMatch = await bcrypt.compare(candidatePassword,this.password);
      return isMatch;
   }catch(err){
      throw err;
   }
}


userSc.methods.createPasswordResetToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex');

   this.passwordResetToken = crypto
         .createHash('sha256')
         .update(resetToken)
         .digest('hex');
   this.passwordResetExpires = Date.now()+10*60*1000;

   return resetToken;   
};

const User = mongoose.model('User',userSc);
module.exports =User;
