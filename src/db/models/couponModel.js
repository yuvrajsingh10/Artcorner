const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({
    name:{
        type:String,
        uppercase:true,
        required:true,
        unique:true,
    },
    expiry:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    }
})

module.exports = mongoose.model("Coupon",couponSchema);