if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const Joi=require("joi");
const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const UserRoute=require("./routes/user.js");

// const DBurl=process.env.Dburl;

// FIX 1: Try multiple variable names and add debugging
const DBurl = process.env.MONGODB_URI || process.env.Dburl || process.env.MONGO_URI;
const SECRET = process.env.SECRET || process.env.SESSION_SECRET || 'fallback-secret-key';

// Debugging logs
console.log('=== Environment Variables Check ===');
console.log('DBurl exists:', !!DBurl);
console.log('SECRET exists:', !!SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!DBurl) {
  console.error('ERROR: MongoDB URL not found!');
  console.error('Available MONGO vars:', Object.keys(process.env).filter(k => k.toLowerCase().includes('mongo')));
  process.exit(1);
}

main()
.then(()=>{
 console.log("connected to db");
})
.catch((err) =>{ 
console.log(err)
});

async function main() {
  await mongoose.connect(DBurl);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store=MongoStore.create({
   mongoUrl:DBurl,
   crypto:{
    secret:process.env.SECRET,
   },
   touchAfter:24*3600,
});
store.on('error', function(error) {
   console.log('Session store error:', error);
});

const sessionOPtion={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
}

// app.get("/",(req,res)=>{
//     res.send("working");
// });

app.use(session(sessionOPtion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.newUser=req.user;
  next()
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",UserRoute);



app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

app.use((err,req,res,next)=>{
   let {statusCode=500,message="something went wrong"} = err;
   res.status(statusCode).render("./listings/error.ejs",{message});
   // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("port start listening");
});
