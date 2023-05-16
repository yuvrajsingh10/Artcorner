const mongoose = require("mongoose")

const productCategorySchema = mongoose.Schema({
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
module.exports = mongoose.model("Product-Category",productCategorySchema)