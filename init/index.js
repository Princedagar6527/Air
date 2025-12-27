// const mongoose=require("mongoose");
// const initData=require("./data.js");
// const Listing=require("../models/listing.js");
// require("dotenv").config();
// //const { deleteMany } = require("../models/listing");
// main()
// .then(()=>{
//  console.log("connected to db");
// })
// .catch((err) =>{ 
// console.log(err)
// });

// async function main() {
//   await mongoose.connect("mongodb+srv://princedagar283:prince123@cluster0.0savdzj.mongodb.net/?appName=Cluster0");
// }

// const initDB= async()=>{
//     await Listing.deleteMany({});
//      initData.data=initData.data.map((obj)=>({...obj,owner:"68f11185d752a002bbfcd1be"}));
//     await Listing.insertMany(initData.data);
//     console.log("data was inserted");
// }
// initDB();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

const MONGO_URL = "mongodb+srv://princedagar283:prince123@cluster0.0savdzj.mongodb.net/?appName=Cluster0";

main()
  .then(() => {
    console.log("connected to db");
    return initDB(); // Call initDB after connection succeeds
  })
  .then(() => {
    console.log("Database initialization complete");
    mongoose.connection.close(); // Close connection when done
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68f11185d752a002bbfcd1be"
  }));
  await Listing.insertMany(initData.data);
  console.log("data was inserted");
};
