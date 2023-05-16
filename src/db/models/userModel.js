const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'User',
        enum: [
            "Admin",
            "Seller",
            "buyer"
        ]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type:String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    refreshToken: {
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256')
        .update(resettoken)
        .digest('hex')
    this.passwordResetTokenExpires = Date.now()+30*60*1000 // Token will expires in 10 minitues
    return resettoken;
}


//Export the model
module.exports = mongoose.model('User', userSchema);