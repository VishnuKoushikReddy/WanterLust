const Listing = require("../models/listing.js");

module.exports.indexRoute = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("errorMsg", "Listing is Doesn't Exists!");
    return res.redirect("/listings");
  }
  const formattedLocation = listing.location.trim().split(/\s+/).join('+') + '+' + listing.country.trim().split(/\s+/).join('+');
  res.render("listings/show.ejs", { listing,formattedLocation });
};

module.exports.insertRoute = async (req, res, next) => {
  let { path: url, filename } = req.file;
  let newListing = Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing is Created!");
  res.redirect("/listings");
};

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("errorMsg", "Listing is Doesn't Exists!");
    return res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing is Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("deleteMsg", "Listing is Deleted!");
  res.redirect("/listings");
};
