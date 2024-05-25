import express from 'express';
import { isAuthenticated } from "userauthenticationforavstreams"
import * as controller from '../controllers/streamControllers'

const router = express.Router()



router.get('/stopStream', isAuthenticated, controller.stopStream)
router.get('/getAllpostOfUser', isAuthenticated, controller.getAllpostOfUser)
router.get('/getAllPosts', isAuthenticated, controller.getAllPosts)
router.get('/getPostFromUser', controller.getPostFromUser)
router.get('/getName', isAuthenticated, controller.getName)
router.get('/getUserVideos', isAuthenticated, controller.getUserVideos)
router.get('/getAllVideos', isAuthenticated, controller.getAllVideos)
router.get('/getVideosWithId', isAuthenticated, controller.getVideosWithId)
router.get('/getMostWatchedVideoUser', isAuthenticated, controller.getMostWatchedVideoUser)
router.get('/searchVideosAndProfile',isAuthenticated,controller.searchVideosAndProfile)

router.get('/getPremiumVideos',controller.getPremiumVideos)

router.post('/uploadPost', isAuthenticated, controller.uploadPost)
router.post('/uploadVideo', isAuthenticated, controller.uploadVideo)

router.patch('/likePost', isAuthenticated, controller.likePost)

router.delete('/deletePostFromCloudinary', isAuthenticated, controller.deletePostFromCloudinary)

export default router  