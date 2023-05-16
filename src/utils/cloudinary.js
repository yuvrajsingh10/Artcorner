const cloudinary = require("cloudinary")


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})


const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve({
                url: result.secure_url,
                asset_id:result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
}

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve({
                url: result.secure_url,
                asset_id:result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
}


module.exports = { cloudinaryUploadImg , cloudinaryDeleteImg}
















// const cloudinary = require('cloudinary').v2;


// // Configuration
// cloudinary.config({
//   cloud_name: "dqiqhyvyc",
//   api_key: "642527629525791",
//   api_secret: "u3gM-nNNnF6FRuZLLBPWFTYvPP8"
// });


// // Upload

// const res = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag"})

// res.then((data) => {
//   console.log(data);
//   console.log(data.secure_url);
// }).catch((err) => {
//   console.log(err);
// });


// // Generate
// const url = cloudinary.url("olympic_flag", {
//   width: 100,
//   height: 150,
//   Crop: 'fill'
// });



// // The output url
// console.log(url);
// // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag