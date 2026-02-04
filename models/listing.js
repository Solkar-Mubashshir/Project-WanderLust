const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 1,
  },
  description: {
    type: String,
  },

  //   image: {
  //     filename: String,
  //     url: String,
  //     default : "https://unsplash.com/photos/green-trees-on-mountain-under-white-clouds-during-daytime-FB8lSUHaKaI",
  //     set : (v) => v === ""
  //     ? "https://unsplash.com/photos/green-trees-on-mountain-under-white-clouds-during-daytime-FB8lSUHaKaI" : v
  //   },

  image: {
    //   filename: {
    //     type: String,
    //     default: "listingimage",
    //   },
    //   url: {
    //     type: String,
    //     default:
    //       "https://images.unsplash.com/photo-1658163724666-77bbb2821b8f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: (v) =>
    //       v == null || v.trim() === ""
    //         ? "https://images.unsplash.com/photo-1658163724666-77bbb2821b8f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //         : v,
    //   },

    url: String,
    filename: String,
  },

  price: {
    type: Number,
    default: 100,
    set: (v) => (v == null ? 100 : v),
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },


  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}



});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
