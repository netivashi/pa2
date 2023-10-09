const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/PA2")
    .then(() => {
        console.log("Done");
    })
    .catch(() => {
        console.log("Not Done");
    })
