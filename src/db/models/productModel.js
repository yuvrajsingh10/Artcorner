const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"category",
        type:String,
        required:true,
        lowercase:true
    },
    // brand:{
    //     type:String,
    //     // enum:["Apple","Samsung","Lenovo"],
    //     required:true,
    //     lowercase:true,
    // },
    quantity:{
        type:Number,
        required:true
    },
    // stock:{
    //     type:String,
    //     // required:true
    //     default:"available"
    // },
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type:Array,
        // required:true
    },
    listedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // color:{
    //     type:String,
    //     // emum:["Black","Blue","Red"],
    //     required:true,
    //     lowercase:true,
    // },

    // tags:[],    
    // ratings:[
    //     {
    //         star:Number,
    //         comment:String,
    //         postedBy:{
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:"User",
    //         } ,
    //     },
    // ],
    totalRating:{
        type:String,
        default:0,
    },
}  ,{ timestamps: true,},)



module.exports = mongoose.model("Product",productSchema)