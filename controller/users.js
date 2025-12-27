const User=require("../models/user");

module.exports.rendersignup=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust!");
        res.redirect("/listings");
     });
    }catch(e){
        req.flash("error","username already exist");
        res.redirect("/signup");
    }
};

module.exports.renderlogin=async(req,res)=>{
     res.render("./users/login.ejs");
};

module.exports.login=async(req,res)=>{
      req.flash("success","Welcome back to Wanderlust!");
      res.redirect("/listings");
    };

    module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};