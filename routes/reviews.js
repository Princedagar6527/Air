const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const{reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{isLoggedIn, isReviewAuthor}=require("../middleware.js");
const Reviewcontroller=require("../controller/reviews.js");

  const validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
  };



//review post route
router.post("/",validateReview,isLoggedIn,wrapAsync(Reviewcontroller.createReview));

//delete route for review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(Reviewcontroller.deleteReview));

module.exports=router;