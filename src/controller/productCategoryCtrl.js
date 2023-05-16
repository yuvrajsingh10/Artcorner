const ProductCategory = require("../db/models/productCategoryModel")
const asyncHandler = require("express-async-handler")
const {validateMongoId} = require("../utils/validateMongoId");


const createCategory = asyncHandler(async (req, res) => {
    try {
        const createCat= req.body;
        const category = await ProductCategory.create(createCat)

        res.json(category)
    } catch (error) {
        throw new Error(error);
    }
})

// Update category
const updateCategory = asyncHandler(async(req,res)=>{
    try {
        const _id = req.params.id
        validateMongoId(_id);
        const updatedCat = await ProductCategory.findByIdAndUpdate(_id,req.body,{
            new:true,
        })

        res.json(updatedCat);
    } catch (error) {
        throw new Error(error)        
    }
})

// getAll category 

const getAllCategories = asyncHandler(async(req,res)=>{
    try {
        const allProductCat = await ProductCategory.find({});
        res.send(allProductCat);
    } catch (error) {
        throw new Error(error)
        
    }
})

// get A Category

const getCategory = asyncHandler( async(req,res)=>{
    try {
        const _id = req.params.id
        validateMongoId(_id)
        const getCat = await ProductCategory.findById(_id)
        res.json(getCat);
    } catch (error) {
        throw new Error(error)
    }
})

// delete category 

const deleteCategory = asyncHandler(async(req,res)=>{
    try {
        const {id}= req.params
        validateMongoId(id)
        const deletedCat = await ProductCategory.findByIdAndDelete(id);

        res.json(deletedCat);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = { createCategory,updateCategory,getAllCategories,getCategory,deleteCategory }