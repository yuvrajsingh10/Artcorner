const User = require('../db/models/userModel')
const Product = require('../db/models/productModel')
const Cart = require('../db/models/addCartModel')
const Coupon = require('../db/models/couponModel')
const Order = require('../db/models/orderModel')


const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { validateMongoId } = require('../utils/validateMongoId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailCtr');
const crypto = require('crypto')
var uniqueid = require('uniqueid')




// ?? creating  User
const registerUser = asyncHandler(async (req, res) => {
    // console.log("yvuraj singh chouhan login")
    try {
        const email = req.body.email
        console.log("this is body", req.body)
        const findUser = await User.findOne({ email });

        if (!findUser) {
            const newUser = await User.create(req.body)
            res.json(newUser)
        }
        else {
            res.status(404).send("user already exist")
            // throw new Error('user already exist')
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
})

// ??? login user if user Exists

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    //  check if user exist of not
    const findUser = await User.findOne({ email })

    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findOneAndUpdate(findUser?._id, {
            refreshToken: refreshToken
        }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            role: findUser?.role,
            token: generateToken(findUser?._id)
        })
    } else {
        console.log(error)
        throw new Error("Invalid credintials")
    }
})

/* here starts admin login functioonality here
 Admin login using jwt token crypto and bycrypt 
*/
const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    //  check if user exist of not
    const findAdmin = await User.findOne({ email })

    if (findAdmin.role !== "Admin") throw new Error("Not Authorised")
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateUser = await User.findOneAndUpdate(findAdmin?._id, {
            refreshToken: refreshToken
        }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })
    } else {
        throw new Error("Invalid credintials")
    }
})

// refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh Token in cookie")
    const refreshToken = cookie.refreshToken

    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error('No refresh token present in db or matched ')

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id)
            throw new Error("There is somthing wrong with refresh token")
        else {
            const accessToken = generateToken(user?._id)
            res.json({ accessToken })
        }
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie.refreshToken) throw new Error("There is no refresh token in cookie")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204) // forbidden
})
// ?? Update User 

const updateUser = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        validateMongoId(_id)
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true
        })
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})


//  get all user 

const getAllUser = asyncHandler(async (req, res) => {

    try {
        const getUsers = await User.find({})
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
});



//  ?? get Single User

const getUser = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const user = await User.findOne({ _id })
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})

// ?? Delete the User
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id
        validateMongoId(_id)
        const user = await User.findByIdAndDelete(_id)
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})


// ?? Block User

const blockUser = asyncHandler(async (req, res, next) => {
    const _id = req.params.id
    validateMongoId(_id)
    try {
        const block = await User.findByIdAndUpdate(_id, {
            isBlocked: true,
        }, {
            new: true,
        })
        res.json({
            message: "User is Blocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async (req, res, next) => {
    const _id = req.params.id
    validateMongoId(_id)
    try {
        const unblock = await User.findByIdAndUpdate(_id, {
            isBlocked: false,
        }, {
            new: true,
        })
        res.json({
            message: "User is UnBlocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})

// ?? update Password functionality
const updatePassword = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user
        const { password } = req.body
        validateMongoId(_id)
        const user = await User.findById(_id)
        console.log(password)
        if (password) {
            user.password = password
            const updatedPassword = await user.save()
            res.json(updatedPassword)
        }
        else {
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})


// ?? sending mail to the user to reset the password || frogot password functionality
const frogotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error('Email is not valid no user found with this email')
    try {

        // generating token valid for 10 min
        const token = await user.createPasswordResetToken();
        await user.save()
        const resetURL = `Hey please follow this link to reset password .
        This link is valid for  10 min from now <a href="http//localhost:4000/api/user/reset-password/${token}">Click here</a>`

        //  users data passes to send the reset password link
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        }
        // sending Email to the user using this function
        sendEmail(data);
        res.json(token)

    } catch (error) {
        
        throw new Error(error);
    }

})

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { password } = req.body
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: { $gte: Date.now() }
        })
        if (!user) throw new Error('Token expired please try again later')
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save()
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})


const getWishList = (asyncHandler(async (req, res) => {
    const _id = req.user;
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);
    } catch (error) {
        throw new Error(error)
    }
}))

//  Saving User address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, { new: true });
        res.json(updateUser)
    } catch (error) {
        throw new Error(error)
    }
})


// User cart

const userCart = asyncHandler(async (req, res) => {
    let { _id, quantity, price } = req.body;
    price = price * quantity;
    const id = req.user._id;
    validateMongoId(id)
    let cart;
    try {
        const alreadyExistProduct = await Cart.findOne({
            productId: _id
        })
        if (alreadyExistProduct) {
            cart = await Cart.findOneAndUpdate({ productId: _id }, {
                quantity,
                price
            }, { new: true })

        } else {
            cart = await new Cart({
                userId: id,
                productId: _id,
                price,
                quantity,
            }).save();
        }
        // let products = [];
        // const user = await User.findById(_id)
        // // if user already have products in cart  
        // const alreadyExistCart = await Cart.findOne({
        //     orderBy: user._id
        // })
        // if (alreadyExistCart) {
        //     alreadyExistCart.remove();
        // }
        // for (let i = 0; i < cart.length; i++) {
        //     let Object = {};
        //     Object.product = cart[i]._id;
        //     // Object.color = cart[i].color;
        //     Object.count = cart[i].count;
        //     let getPrice = await Product.findById(cart[i]._id).select("price").exec()
        //     Object.price = getPrice.price;
        //     products.push(Object);
        // }

        // let cartTotal = 0
        // for (let i = 0; i < products.length; i++) {
        //     cartTotal = cartTotal + products[i].price * products[i].count
        // }


        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }
})




// get user cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id)
    try {
        const cart = await Cart.find({ userId: _id }).populate(
            'productId'
        )
        res.json(cart)
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
})

const removeProductfromCart=asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {productId}=req.params.id;
    validateMongoId(_id);
    try {
        const cart = await Cart.findOneAndRemove(productId);
        res.json(cart);
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
})

// empty cart functionality
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id)
    try {
        const user = await User.findOne(_id)
        const cart = await Cart.findOneAndRemove({ userId: user?._id })
        console.log(cart)
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
})

//  Apply Coupon functionality

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoId(_id);
    try {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
            throw new Error("Invalid Coupon");
        }
        const user = await User.findOne(_id);
        let { cartTotal } = await Cart.findOne({ orderedBy: user._id })
            .populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
        await Cart.findOneAndUpdate(
            { orderedBy: user._id },
            { totalAfterDiscount },
            { new: true });
        res.json(totalAfterDiscount)
    } catch (error) {
        throw new Error(error)
    }
})


const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoId(_id);
    try {
        if (!COD) throw new Error("create Cash order failed")
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderedBy: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount
        } else {
            finalAmount = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqueid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash On Delivery",
                created: Date.now(),
                currency: "usd",

            },
            orderedBy: user._id,
            orderStatus: "Cash On Delivery"
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updatedProduct = await Product.bulkWrite(update, {});
        res.json({
            msg: "Payment Success"
        })

    } catch (error) {
        throw new Error(error)
    }
})

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoId(_id)
    try {
        const userOrders = await Order.findOne({ orderedBy: _id })
            .populate("products.product")
            .exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error)
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id,
            {
                orderStatus: status,
                paymentIntent: {
                    status
                }
            },
            { new: true }
        )
        res.json(updateOrderStatus)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    registerUser,
    loginUser,
    loginAdmin,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    frogotPasswordToken,
    resetPassword,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    removeProductfromCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
}