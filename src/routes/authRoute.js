const express = require('express')
const router = express.Router();
const { registerUser, loginUser, getAllUser, getUser, deleteUser, updateUser, unblockUser,
    blockUser, handleRefreshToken, logoutUser, updatePassword, frogotPasswordToken, resetPassword, loginAdmin, getWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus, removeProductfromCart } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');



router.post('/register', registerUser);


router.post('/login', loginUser)
router.post('/adminLogin', loginAdmin)
router.put('/cart',authMiddleware, userCart)
// router.post('/cart/applycoupon',authMiddleware,applyCoupon)
router.post('/cart/cashOrder',authMiddleware,createOrder)

router.get('/logout', logoutUser)
router.get('/allUser',authMiddleware, isAdmin, getAllUser)
router.get('/getOrders',authMiddleware, getOrders)
router.get('/refresh', handleRefreshToken)
router.get('/wishList', authMiddleware,getWishList );
router.get('/cart', authMiddleware,getUserCart);
router.get('/getUser/:id', authMiddleware, isAdmin, getUser)

router.delete('/emptyCart',authMiddleware,emptyCart)
router.delete('/deleteUser/:id', deleteUser)
router.delete('/removeproductcart/:id', authMiddleware,removeProductfromCart);

router.put('/forgotPasswordToken',frogotPasswordToken)
router.put('/order/updateOrder/:id',authMiddleware,isAdmin,updateOrderStatus)
router.put('/saveAddress', authMiddleware, saveAddress);
router.put('/updatePassword', authMiddleware, updatePassword);
router.put('/updateUser', authMiddleware, isAdmin, updateUser)
router.put('/blockUser/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblockUser/:id', authMiddleware, isAdmin, unblockUser)
router.put('/resetPassword/:token',resetPassword)




module.exports = router