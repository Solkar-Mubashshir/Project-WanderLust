const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createlisting = async (req, res, next) => {

   try {
    // 1️⃣ Fetch geocoding results from Nominatim
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        req.body.listing.location
      )}`,
      {
        headers: { "User-Agent": "WanderLust-App" }
      }
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    // 2️⃣ Try to find a match that contains the user input (case-insensitive)
    const cityMatch =
      geoData.find(place =>
        place.display_name.toLowerCase().includes(req.body.listing.location.toLowerCase())
      ) || geoData[0]; // fallback to first result

    // 3️⃣ Create the new listing
    const newListing = new Listing(req.body.listing);

    // 4️⃣ Set geometry to chosen coordinates
    newListing.geometry = {
      type: "Point",
      coordinates: [cityMatch.lon, cityMatch.lat]
    };

    // 5️⃣ Set owner
    newListing.owner = req.user._id;

    // 6️⃣ Add image if uploaded
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // 7️⃣ Save to database
    await newListing.save();

    req.flash("success", "Listing created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    next(e);
  }


//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New listing Created!");
//   res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250,h_250,c_fill",
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send a vaild data for listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
