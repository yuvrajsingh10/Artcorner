const Product = require('../db/models/productModel')
const User = require("../db/models/userModel")
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const { validateMongoId } = require("../utils/validateMongoId")
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary')
const fs = require("fs")


const createProduct = asyncHandler(async (req, res) => {
    try {
        const {_id}=req.user;
        validateMongoId(_id)
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const {title,price,slug,description,category,quantity,images} = req.body
        const newProduct = await Product.create({
            title,
            price,
            slug,
            description,
            category,
            quantity,
            images,
            listedBy:_id
        })
        res.json(newProduct)
    } catch (error) {
        console.log(error)
        throw new Error("There is some error in the creatinon of product", error)
    }
})


// ?? updating product details
const updateProduct = asyncHandler(async (req, res) => {

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const _id = req.params.id
        const updateProduct = await Product.findByIdAndUpdate(_id, req.body, { new: true })

        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }

})


// ?? delete product 
const deleteProduct = asyncHandler(async (req, res) => {

    try {
        const _id = req.params.id
        const deleteProduct = await Product.findByIdAndDelete(_id)
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// ?? gettins Product details
const getAProduct = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id
        const findProduct = await Product.findById(_id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {

        // Filtering the product  
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'limit', "sort", "fields"]
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|gt|lte|le) \b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr));




        // ??? Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            const query = query.sort(sortBy)
        } else {
            query = query.sort("createdBy")
        }

        // ??? Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        }
        else {
            query = query.select("-__v")
        }


        // ??? Pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page is not exist")
        }

        //  Executing Query
        const getAllProduct = await query
        res.json(getAllProduct)
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
})


// add product to whistlist 
const wishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const  productId  = req.body._id   
    console.log(req.body)
    try {
        validateMongoId(_id)
        validateMongoId(productId)
        const user = await User.findById(_id);
        const alreadyAdded = user?.wishlist?.find((id) => id.toString() === productId);

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: productId },
            }, { new: true })
            res.json(user)
        }
        else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: productId },
            }, { new: true })
            res.json(user)
        }

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
})


//  Product ratings

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body
    try {
        const product = await Product.findById(productId);
        const alreadyRated = await product?.ratings?.find((userId) => userId.postedBy.toString() === _id.toString())
        if (alreadyRated) {
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment },
            }, { new: true });
        }
        else {
            let rateProduct = await Product.findByIdAndUpdate(productId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id,
                    },
                },
            }, { new: true });

        }


        //  calculatin the all no of rating gives by the users
        const getAllRatings = await Product.findById(productId);
        const totalRatings = getAllRatings.ratings.length;

        // caluculating the total rating  gives by the all user
        const ratingSum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let acutalRating = Math.round(ratingSum / totalRatings)

        //  updating the total rating to the db
        let finalRatedProduct = await Product.findByIdAndUpdate(productId, {
            totalRating: acutalRating,
        }, { new: true })
        res.json(finalRatedProduct);

    } catch (error) {
        throw new Error(error)
    }
})


// upload images to the database 

const uploadImgaes = asyncHandler(async (req, res) => {
    // const { id } = req.params
    // console.log(req.files)
    try {
        // validateMongoId(id);
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        // console.log(urls)
        const images = urls.map((file) => {
            return file;
        })
        res.json(images)


        // ============================== old code ========================== //
        // const findProduct = await Product.findByIdAndUpdate(id, {
        //     images: urls.map((file) => {
        //         return file;
        //     })
        // }, { new: true })
        // res.json(findProduct)


    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
})

const deleteImgaes = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {

        const deleter = cloudinaryDeleteImg(id, "images")
        res.json({
            msg: "image deleted"
        })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createProduct,
    getAProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    wishList,
    rating,
    uploadImgaes,
    deleteImgaes,
}
