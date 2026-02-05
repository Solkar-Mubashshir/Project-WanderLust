// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
// main()
//   .then((res) => {
//     console.log("connected to DB");
//   })
//   .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
// }

// const initDB = async () => {
//     await Listing.deleteMany({});
// initData.data = initData.data.map((obj) => ({...obj, owner:"69811c74b6dbd8659c3073f4"}))
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// }

// initDB();




require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  await initDB(); // ✅ run after connection
  mongoose.connection.close();
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "69839adea2a51232b352f0be", // make sure this user exists
  }));

  await Listing.insertMany(listingsWithOwner); // ✅ FIXED
  console.log("Database initialized with sample data");
};

main().catch((err) => {
  console.log(err);
});
