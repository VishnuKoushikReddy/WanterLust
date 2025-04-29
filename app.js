const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const Review = require("./models/reviews.js");

const PORT = 3000;

main()
  .then((res) => {
    console.log("Connected to Database ...");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg=error.details.map((el)=> el.message.join(","));
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg=error.details.map((el)=> el.message.join(","));
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send("I am root");
});

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs", { listing });
  })
);

//Insert Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//Reviews Post Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=> {
  let listing=await Listing.findById(req.params.id);
  let newReview= new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=> {
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.get("/testListing",async (req,res)=> {
//     let sampleList=new Listing({
//         title: "Home",
//         description: "It is my Home",
//         image: "https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg",
//         price: 2000,
//         location: "Nellore",
//         country: "India"
//     });
//     await sampleList.save();
//     console.log("Saved");
//     res.send("Successfully Saved");
// });

app.listen(PORT, () => {
  console.log("Server Listening ...");
});
