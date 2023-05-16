const express = require('express')
const { createCategory, updateCategory, deleteCategory, getAllCategories, getCategory } = require('../controller/productCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.get("/",getAllCategories)
router.get("/:id",getCategory)
router.post("/",authMiddleware,isAdmin,createCategory);
router.put("/:id",authMiddleware,isAdmin,updateCategory)
router.delete("/:id",authMiddleware,isAdmin,deleteCategory)


module.exports = router