const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Posts = require('../models/Posts');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the posts using: GET "/api/posts/getuser". Login required
router.get('/fetchallposts', fetchuser, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id });
        res.json(Post)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Post using: POST "/api/posts/addPost". Login required
router.post('/addpost', fetchuser, [
    body('caption', 'Enter a valid caption').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { caption,location, description, images } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const post = new Posts({
                caption,location, description, images, user: req.user.id
            })
            const savedPost = await post.save()

            res.json(savedPost)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update an existing Post using: PUT "/api/posts/updatePost". Login required
router.put('/updatePost/:id', fetchuser, async (req, res) => {
    const { caption,location, description, images } = req.body;
    try {
        // Create a newPost object
        const newPost = {};
        if (caption) { newPost.caption = caption };
        if (description) { newPost.description = description };
        if (location) { newPost.location = location };

        // Find the Post to be updated and update it
        let post = await Post.findById(req.params.id);
        if (!post) { return res.status(404).send("Not Found") }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        post = await Post.findByIdAndUpdate(req.params.id, { $set: newPost }, { new: true })
        res.json({ post });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Post using: DELETE "/api/posts/deletePost". Login required
router.delete('/deletePost/:id', fetchuser, async (req, res) => {
    try {
        // Find the Post to be delete and delete it
        let post = await Post.findById(req.params.id);
        if (!post) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Post
        if (Post.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        post = await Post.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Post has been deleted", Post: post });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router