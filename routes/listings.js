const express = require('express');
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isOwner}=require("../middleware.js");
const listingcontroller=require("../controller/listings.js")
const multer  = require('multer');
const{storage}=require("../cloudconfig.js");
const upload = multer({storage })



const validateListing=(req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
  };

//index route
router.get("/",wrapAsync(listingcontroller.index));

//new route
router.get("/new",isLoggedIn,listingcontroller.renderNewForm
);

//create route
router.post("/",upload.single("listing[image]"),isLoggedIn, wrapAsync(listingcontroller.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editListing));
//show route
router.get("/:id",wrapAsync(listingcontroller.showListing));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.updateListing));


//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingcontroller.deleteListing));
module.exports=router;