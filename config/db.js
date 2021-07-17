const mongoose = require('mongoose');
const config = require('config');

const db = config.get('MongoURI');

//connect kreinge db se is function mein ,connect mongoose ka method hai connect krne ke liye db se 
const connectDB = async () => {
    try {
        //db se connect krrhe
        await mongoose.connect(db, {
            //warnings ignore krrhe hain yhn pe
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB")
    }
    catch (err) {
        console.error(err.message)
        process.exit(1);
    }
};

module.exports = connectDB;