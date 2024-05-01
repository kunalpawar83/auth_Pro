const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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

     }
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


const User = mongoose.model('User',userSc);
module.exports =User;
