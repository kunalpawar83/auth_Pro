const User = require('../models/userModel.js');
const {generateToken} = require('../utils/jwt.js');

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
// kunal