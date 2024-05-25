import express from 'express';
import { isAdminAuthenticated } from 'userauthenticationforavstreams';
import * as adminController from '../controllers/adminController';
const router = express.Router()


router.get('/isAdminAuth',isAdminAuthenticated,adminController.isAdminAuth)
router.get('/getAllUsers',isAdminAuthenticated, adminController.getAllUsers)
router.get('/blockUser',isAdminAuthenticated, adminController.blockUser)
router.get('/getBannerByLocation',isAdminAuthenticated,adminController.getBannerByLocation)


router.post('/addbanner',isAdminAuthenticated,adminController.addBanner)
router.post('/adminPostLogin', adminController.adminPostLogin)
router.post('/createUser',isAdminAuthenticated,adminController.createUser)


export default router