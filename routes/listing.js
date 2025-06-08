const express = require("express");
require("dotenv").config();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Get Index Route
//Post Insert Route
router
  .route("/")
  .get(wrapAsync(listingController.indexRoute))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.insertRoute)
  );

//New Route
router.get("/new", isLoggedIn, listingController.newRoute);

//Show Route
//Update Route
//Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showRoute))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editRoute)
);

module.exports = router;
