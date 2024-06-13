import express from 'express';
import { isAdminAuthenticated } from 'userauthenticationforavstreams';
import * as adminController from '../controllers/adminController';
const router = express.Router()


router.get('/isAdminAuth', isAdminAuthenticated, adminController.isAdminAuth)
router.get('/getAllUsers', isAdminAuthenticated, adminController.getAllUsers)
router.get('/blockUser', isAdminAuthenticated, adminController.blockUser)
router.get('/getPremiumUsers', isAdminAuthenticated, adminController.getPremiumUsers)
router.get('/getDoungnutData', isAdminAuthenticated, adminController.getDoungnutData)
router.get('/getLastSubscriptions', isAdminAuthenticated, adminController.getLastSubscriptions)

router.get('/getBannerByLocation', adminController.getBannerByLocation)
router.post('/addbanner', isAdminAuthenticated, adminController.addBanner)
router.post('/adminPostLogin', adminController.adminPostLogin)
router.post('/createUser', isAdminAuthenticated, adminController.createUser)
router.post('/updateBanner', isAdminAuthenticated, adminController.updateBanner)


router.patch('/cancelSubscription', isAdminAuthenticated, adminController.cancelSubscription)


export default router