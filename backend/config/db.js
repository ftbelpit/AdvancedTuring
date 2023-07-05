const mongoose = require("mongoose")
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const connectToDB = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@turingwash.lwcirwb.mongodb.net/?retryWrites=true&w=majority`
    )

    console.log("Conectou ao banco")

    return dbConn
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectToDB

// const mongoose = require("mongoose");

// const conn = async () => {
//   try {
//     const dbConn = await mongoose.connect("mongodb://localhost:27017/TuringWash");
    
//     console.log("Conectou ao banco local");

//     return dbConn;
//   } catch (error) {
//     console.log(error);
//   }
// };

// conn();

// module.exports = conn;

// connection