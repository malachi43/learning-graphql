const mongoose = require("mongoose");

const connectToDatabase = async (url) => {
    try {
        return mongoose.connect(url);
    } catch (error) {
        console.log("Error: ", error.message);
        process.exit(1);
    }
}


module.exports = connectToDatabase