const express = require("express")
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, getBlog, getAllBlog, deleteBlog, updateBlog, likeBlog, dislikeBlog, uploadImgaes } = require('../controller/blogCtrl');
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

router.get("/",getAllBlog)

router.post('/', authMiddleware, createBlog)

router.put("/likes",authMiddleware,likeBlog)
router.put("/dislikes",authMiddleware,dislikeBlog)
router.put('/:id',authMiddleware,getBlog)
router.put("/:id",authMiddleware,isAdmin,updateBlog)
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize,uploadImgaes)

router.delete("/:id",authMiddleware,isAdmin,deleteBlog)

module.exports = router;