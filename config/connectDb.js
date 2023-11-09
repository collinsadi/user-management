const mongoose = require("mongoose")
require("dotenv").config()
const mongoUri = process.env.MONGO_URI
const colors = require("colors")


const connectDatabase = ()=>{

    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongodb Database Connected".green);
    })
    .catch((error) => {
        console.log("An Error Occured Conecting to MongoDb: ".red + error);
    });

}

module.exports = connectDatabase;