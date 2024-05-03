const express = require('express');
//const User  = require('../models/userModel.js');
const {jwtAuthMiddleware,generateToken} = require('../utils/jwt.js');
const AuthCont = require('../controller/authCont.js');


const router = express.Router();

//  SIGNUP ROUTE
router.post('/signup',AuthCont.signup);
// login Route
router.post('/login',AuthCont.login);


// forgot password 
router.post('/forgotpassword',AuthCont.forgotPassword);
// reset password
router.patch  ('/resetpassword/:token',AuthCont.resetPassword);

router.get('/getalldata',AuthCont.getALlData);

module.exports =router;
