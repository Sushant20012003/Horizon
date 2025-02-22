import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { editProfile } from '../controllers/user.controller.js';
import { addComment, addNewPost, bookmarkPost, deletePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPost);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').get(isAuthenticated, getCommentsOfPost);
router.route('/:id/delete').delete(isAuthenticated, deletePost);
router.route('/:id/bookmark').post(isAuthenticated, bookmarkPost);

export default router;