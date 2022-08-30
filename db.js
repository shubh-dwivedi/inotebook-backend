const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true";
const mongoURI = "mongodb+srv://mongouser:54321@cluster0.9lbcgo4.mongodb.net/inotebook?retryWrites=true&w=majority";

const connectToMongo = ()=> {
    mongoose.connect(mongoURI, ()=> {
        console.log("Connected to mongoose database successfully!")
    })
}

module.exports = connectToMongo;