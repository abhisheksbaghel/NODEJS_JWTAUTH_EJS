const express = require('express');
const router = express.Router();
const {adminAuth} = require('../../middleware/auth');

const Posts = require('../../models/Posts');

    //create
    router.post('/', async (req, res) => {
    const newPost = new Posts(req.body);
    try {
    const post = await newPost.save();
    if(!post) throw Error('Something went wrong with the post')
    res.status(200).json(post);
    } catch(error) {
    res.status(400).json({msg: error})
    }
    });

    //get all posts
    router.route('/').get(adminAuth, async (req, res) => {
        try {
        const posts = await Posts.find();
        if(!posts) throw Error('No Items');
        res.status(200).json(posts);
        }catch(err) {
        res.status(400).json({msg: err})
        }
        });

    //show one post
    router.get('/:id', async (req, res) => {
        try {
        const post = await Posts.findById(req.params.id);
        if(!post) throw Error('No Items');
        res.status(200).json(post);
        }catch(err) {
        res.status(400).json({msg: err})
        }
        });
    
    //update
    router.patch('/:id', async (req, res) => {
        try {
        const post = await Posts.findByIdAndUpdate(req.params.id, req.body);
        if(!post) throw Error('Something went wrong while updating the post');
        res.status(200).json({success: true});
        }catch(err) {
        res.status(400).json({msg:err});
        }
        });

    //delete
    router.delete('/:id', async (req, res) => {
        try {
        const post = await Posts.findByIdAndDelete(req.params.id);
        if(!post) throw Error('No post found!');
        res.status(200).json({success: true})
        }catch(err) {
        res.status(400).json({msg: err})
        }
        });

module.exports = router;