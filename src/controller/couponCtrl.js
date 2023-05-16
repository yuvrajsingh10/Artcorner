const Coupon = require("../db/models/couponModel")
const asyncHandler = require("express-async-handler")
const {validateMongoId} = require("../utils/validateMongoId")

const createcCoupons = asyncHandler(async (req, res) => {
    try {
        const coupon = req.body;
        const newCoupon = await Coupon.create(coupon);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

// update Coupons
const updateCoupons = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const coupon = req.body;
        const updatedCoupon = await Coupon.findByIdAndUpdate(_id, coupon,
            { new: true });
        res.json(updatedCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

// delete coupons 
const deleteCoupons = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const deletedCoupon = await Coupon.findByIdAndDelete(_id);
        res.json(deletedCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

// getAll Coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const allCoupon = await Coupon.find();
        res.json(allCoupon);
    } catch (error) {
        throw new Error(error);
    }
})



module.exports = { createcCoupons, updateCoupons, deleteCoupons, getAllCoupons }