const mongoose = require("mongoose")

const blogCategorySchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{
    timestamps:true
})

// exporting category module
module.exports = mongoose.model("Blog-Category",blogCategorySchema);