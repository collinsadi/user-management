const express = require("express")
const connectDatabase = require("./config/connectDb")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const colors = require("colors")


// Routes
const userRoutes = require("./routes/user.routes")






// Use Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// use Routes
app.use("/api/v1/users",userRoutes)



app.listen(port, () => {
    console.log(`User Management Server Started at Port ${port}`.green);
})

connectDatabase() //? Connect To Mongo Database