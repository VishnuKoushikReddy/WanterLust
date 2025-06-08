const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReviewRoute = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review id Added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReviewRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("deleteMsg", "Review is Deleted!");
  res.redirect(`/listings/${id}`);
};
