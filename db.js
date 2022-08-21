const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://api_test:DuWFy9lunAMpTr1E@apitest.llbhl.mongodb.net/instagram_user"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;