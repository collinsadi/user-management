const { MongoClient } = require("mongodb")
require("dotenv").config()
const client = new MongoClient(process.env.FOREIGN_DB)

const notficationModel = async () => {
    
    await client.connect()
    const db = client.db("editor")
    const Notification = db.collection("notification")

    return Notification
}


module.exports = { notficationModel }