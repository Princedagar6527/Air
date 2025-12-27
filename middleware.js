 const Listing=require("./models/listing.js");
 const Review=require("./models/review");


 module.exports.isLoggedIn=(req,res,next)=>{
 if(!req.isAuthenticated()){
    req.flash("error","you must be logged in to create new listing!");
    return res.redirect("/login");
   }
   next();
};

module.exports.isOwner=async(req,res,next)=>{
   let{id}=req.params;
   let listing=await Listing.findById(id);
   if(!listing.owner.equals(res.locals.newUser._id)){
      req.flash("error","you are not the author of this Review");
      return res.redirect(`/listings/${id}`);
   }
   next()
};

module.exports.isReviewAuthor=async(req,res,next)=>{
   let{id,reviewId}=req.params;
   let review=await Review.findById(reviewId);
   if(!review.author.equals(res.locals.newUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
   }
   next()
};