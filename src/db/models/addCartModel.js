const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    // orderedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // }
}, {
    timestamps: true,
})

//  Export the cart  model
module.exports = mongoose.model("Cart",CartSchema);