const express = require('express')
const { createProduct, getAProduct, getAllProducts, updateProduct,
    deleteProduct, wishList, rating, uploadImgaes, deleteImgaes } = require('../controller/productCtrl')
const { isAdmin, authMiddleware, isAuthorizeSeller } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router()

router.put("/rating", authMiddleware, rating);
router.get('/:id', getAProduct)
router.get('/', getAllProducts)

router.post('/', authMiddleware, isAuthorizeSeller, createProduct)
router.put('/upload/', authMiddleware, isAuthorizeSeller, uploadPhoto.array('images', 10), productImgResize, uploadImgaes)
router.put("/wishlist", authMiddleware, wishList)

router.put('/:id', authMiddleware, isAdmin, updateProduct)

router.delete('/:id', authMiddleware, isAdmin, deleteProduct)
router.delete('/deleteImages/:id', authMiddleware, isAdmin, deleteImgaes)

module.exports = router