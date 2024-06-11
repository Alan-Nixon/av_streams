import express from 'express';
import { isAdminAuthenticated, isAuthenticated } from "userauthenticationforavstreams"
import * as controller from '../controllers/streamControllers'

const router = express.Router()



router.get('/stopStream', isAuthenticated, controller.stopStream)
router.get('/getAllpostOfUser', isAuthenticated, controller.getAllpostOfUser)
router.get('/getAllPosts', isAuthenticated, controller.getAllPosts)
router.get('/getPostFromUser', controller.getPostFromUser)
router.get('/getName', isAuthenticated, controller.getName)
router.get('/getUserVideos', isAuthenticated, controller.getUserVideos)
router.get('/getVideosWithId', isAuthenticated, controller.getVideosWithId)
router.get('/getMostWatchedVideoUser', isAuthenticated, controller.getMostWatchedVideoUser)
router.get('/searchVideosAndProfile', isAuthenticated, controller.searchVideosAndProfile)

router.get('/getPremiumVideos', controller.getPremiumVideos)
router.get('/getAllVideos', controller.getAllVideos)


router.post('/uploadPost', isAuthenticated, controller.uploadPost)
router.post('/uploadVideo', isAuthenticated, controller.uploadVideo)
router.post('/addReportSubmit', isAuthenticated, controller.addReportSubmit)

router.patch('/likePost', isAuthenticated, controller.likePost)

router.delete('/deletePostFromCloudinary', isAuthenticated, controller.deletePostFromCloudinary)



// admin routes
router.get('/getCategory', controller.getCategory)

router.get('/getReportsBySection', isAdminAuthenticated, controller.getReportsBySection)
router.get('/getBlockedVideos', isAdminAuthenticated, controller.getBlockedVideos)
router.get('/getPostDongnutData', isAdminAuthenticated, controller.getPostDongnutData)


router.patch('/blockcategory', isAdminAuthenticated, controller.blockcategory)
router.patch('/blockContentVisiblity', isAdminAuthenticated, controller.blockContentVisiblity)
router.patch('/ChangeVisiblityContent', isAdminAuthenticated, controller.changeVisiblityContent)

router.post('/addCategory', isAdminAuthenticated, controller.addCategory)


export default router  