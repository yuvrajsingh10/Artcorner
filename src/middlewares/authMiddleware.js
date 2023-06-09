const User = require('../db/models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


// ???/ checks if the user  is authorized 

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    console.log(req.headers)
    if (req.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        console.log(token)
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded)
                const user = await User.findById(decoded.id)
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Not Authorized token expired ,Please Login Again')
        }
    }
    else {
        throw new Error("There is noe token attached to tha header")
    }
})


// ??? Checks if user is Admin

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.user;
        const adminUser = await User.findOne({ email })
        // console.log(adminUser)
        if (adminUser.role != "Admin") {
            throw new Error("You are not an admin or seller")
        }
        else {
            next();
        }
    } catch (error) {
        throw new Error(error)
    }
})

const isAuthorizeSeller = asyncHandler(async (req, res, next) => {
    try {
        const { email } = req.user;
        const authorizeUser = await User.findOne({ email })
        console.log(authorizeUser)
        if (authorizeUser.role === "Admin" || authorizeUser.role === "Seller")
            next();
        else {
            throw new Error("You are not authorize person to List Product");

        }
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { authMiddleware, isAdmin, isAuthorizeSeller }