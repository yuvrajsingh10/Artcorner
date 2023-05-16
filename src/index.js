const express = require('express')
const app = express();
const dotenv = require('dotenv').config();
const initDbConnection = require('./db/init')
const port = process.env.PORT || 3000;
const authRouter= require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const blogRouter = require("./routes/blogRoutes")
const productCategoryRoute = require("./routes/productCategoryRoute")
const blogcategoryRoute = require("./routes/blogCategoryRoute");
const couponRoute= require("./routes/couponsRoute")
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const notfound= require('./middlewares/errorHandler')
const errHandler= require('./middlewares/errorHandler');


// app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product',productRoute)
app.use("/api/blog",blogRouter)
app.use("/api/category",productCategoryRoute)
app.use("/api/BlogCategory",blogcategoryRoute)
app.use("/api/coupons",couponRoute)

app.use(notfound)
app.use(errHandler)


initDbConnection()
.then(()=>{
    console.log("Db Connection established")
    app.listen(port,()=>{
        console.log(`Server Running at PORT ${port}`)
    })
})
.catch((error)=>{
    console.log('404 Error',error)
})


