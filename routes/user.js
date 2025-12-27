const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const usercontroller=require("../controller/users.js");


router.get("/signup",usercontroller.rendersignup);

router.post("/signup",wrapAsync(usercontroller.signup));

router.get("/login",usercontroller.renderlogin);

router.post("/login",passport.authenticate(
    "local",{
        failureRedirect:"login",
        failureFlash:true,
    }),
    usercontroller.login
);

router.get("/logout",usercontroller.logout);

module.exports=router;