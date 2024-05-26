import express from 'express';
import { isAdminAuthenticated } from 'userauthenticationforavstreams';
import * as adminController from '../controllers/adminController';
const router = express.Router()


router.get('/isAdminAuth', isAdminAuthenticated, adminController.isAdminAuth)
router.get('/getAllUsers', isAdminAuthenticated, adminController.getAllUsers)
router.get('/blockUser', isAdminAuthenticated, adminController.blockUser)
router.get('/getBannerByLocation', isAdminAuthenticated, adminController.getBannerByLocation)
router.get('/getPremiumUsers', isAdminAuthenticated, adminController.getPremiumUsers)

router.post('/addbanner', isAdminAuthenticated, adminController.addBanner)
router.post('/adminPostLogin', adminController.adminPostLogin)
router.post('/createUser', isAdminAuthenticated, adminController.createUser)
router.post('/updateBanner', isAdminAuthenticated, adminController.updateBanner)

router.patch('/cancelSubscription', isAdminAuthenticated, adminController.cancelSubscription)


export default router