const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;
const Review=require('./reviews.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2023/03/31/17/18/carchi-7890573_1280.jpg",
    set: (v) =>
      v === ""
        ? "https://cdn.pixabay.com/photo/2023/03/31/17/18/carchi-7890573_1280.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

listingSchema.post('findOneAndDelete', async(listing)=> {
  if(listing) {
    await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
