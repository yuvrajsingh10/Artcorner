const Blog = require('../db/models/blogModel')
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require('../utils/validateMongoId');
const {cloudinaryUploadImg} = require("../utils/cloudinary")
const fs = require("fs")

const createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = req.body;
        const newBlog = await Blog.create(blog)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const getBlog = await Blog.findByIdAndUpdate(_id, {
            $inc: { numViews: 1 }
        }, {
            new: true
        })
        .populate('likes')
        .populate("dislikes")
        res.json(getBlog);
    } catch (error) {
        throw new Error(error)
    }
})

// Get all Blog
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAllBlog = await Blog.find()
        res.json(getAllBlog);
    } catch (error) {
        throw new Error(error)
    }
})

// update blog 
const updateBlog = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const updatedBlog = await Blog.findByIdAndUpdate(_id, req.body, {
            new: true,
        })
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error)
    }
})

// Delete A blog

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const _id = req.params.id;
        validateMongoId(_id)
        const deletedBlog = await Blog.findByIdAndDelete(_id)
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error)
    }
})


// update likes 
const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoId(blogId)

        // find the blog 
        const blog = await Blog.findById(blogId)

        // find the logged in user
        const loginUserId = req?.user?._id

        // find if the user has liked  the post 
        const isLiked = blog?.isLiked;

        // find the user if he disliked the post 
        const alreadyDisliked = blog?.dislikes?.find((userId) => userId.toString() === loginUserId.toString());

        if (alreadyDisliked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            }, {
                new: true,
            })
            res.json(blog)
        }
        if (isLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, {
                new: true,
            })
            res.json(blog)
        }
        else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true,
            }, {
                new: true,
            })
            res.json(blog)
        }

    } catch (error) {
        throw new Error(error)
    }
})


// update dislikes 
const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoId(blogId)
        // find the blog 
        const blog = await Blog.findById(blogId)

        // find the logged in user
        const loginUserId = req?.user?._id

        // find if the user has liked  the post 
        const isDisliked = blog?.isDisliked;

        // find the user if he disliked the post 
        const alreadyLiked = blog?.dislikes?.find((userId) => userId.toString() === loginUserId.toString());

        if (alreadyLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, {
                new: true,
            })
            res.json(blog)
        }
        if (isDisliked) {
            console.log("working")
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            }, {
                new: true,
            })
            res.json(blog)
        }
        else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            }, {
                new: true,
            })
            res.json(blog)
        }

    } catch (error) {
        throw new Error(error)
    }
})


// upload images to the database 

const uploadImgaes = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        validateMongoId(id);
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            })
        }, { new: true })
        res.json(findBlog)
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
})

module.exports = { createBlog, getBlog, getAllBlog, deleteBlog, updateBlog, likeBlog, dislikeBlog,uploadImgaes }