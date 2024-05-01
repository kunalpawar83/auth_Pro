const express = require('express');
const User  = require('../models/userModel.js');
const {jwtAuthMiddleware,generateToken} = require('../utils/jwt.js');
const AuthCont = require('../controller/authCont.js');
const multer = require('multer');

const multerStorage = multer.diskStorage({
   destination:(req,file,cb)=>{
       cb(null,'imgUser');
   },
   filename:(req,file,cb)=>{
      const ext = file.mimetype.split('/')[1];
      cb(null,`user-${Date.now()}.${ext}`);
   }
});

const multerFilter = (req,file,cb)=>{
   if(file.mimetype.startsWith('image')){
      cb(null,true);
   }else{
      cb('Not a image ! please upload image',false);
   }
}

const upload =  multer({
   storage:multerStorage,
   fileFilter:multerFilter   
});


const router = express.Router();

//  SIGNUP ROUTE
router.post('/signup',AuthCont.signup);

// login Route
router.post('/login',AuthCont.login);

router.get('/getalldata',AuthCont.getALlData);

module.exports =router;
