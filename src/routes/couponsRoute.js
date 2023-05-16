const express = require("express")
const { createcCoupons, updateCoupons, deleteCoupons, getAllCoupons } = require("../controller/couponCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/",authMiddleware,getAllCoupons)
router.post("/",authMiddleware,isAdmin,createcCoupons)
router.put("/:id",authMiddleware,isAdmin,updateCoupons)
router.delete("/:id",authMiddleware,isAdmin,deleteCoupons)


module.exports = router