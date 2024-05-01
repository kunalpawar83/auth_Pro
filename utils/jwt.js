const jwt = require('jsonwebtoken');
const key = "kunal_29/06/2003"



const jwtAuthMiddleware  = ( req,res,next)=>{
      
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
         return res.status(400).json({
            status:"fail",
            error:"unauthorized"
         })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        console.log(err);
        res.status(400).json({
            status:"fail",
            error:"Invalid token"
        })
                   
    }
};


const generateToken = (userdata)=>{
            return jwt.sign(userdata,process.env.JWT_SECRET);
};


module.exports = {jwtAuthMiddleware,generateToken};