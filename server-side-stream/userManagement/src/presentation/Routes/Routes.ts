import express from 'express';
const router = express.Router()
import * as controller from '../controllers/userController'

import { isAuthenticated } from "userauthenticationforavstreams"


//user get
router.get('/sendOtp', controller.sendOtp)
router.get('/forgetPasswordOtpSend', controller.forgetPasswordOtpSend)
router.get('/userDetails', isAuthenticated, controller.isBlocked, controller.userDetails)
router.get('/isUserAuth', controller.authenticated)
router.get('/getWalletDetails', isAuthenticated, controller.getWalletDetails)
router.get('/isPremiumUser', isAuthenticated, controller.isPremiumUser)
router.get('/isFollowing', isAuthenticated, controller.isFollowing)
router.get('/followChannel', isAuthenticated, controller.followChannel)
router.get('/getChannelById', isAuthenticated, controller.getChannelById)
router.get('/getChannelByUserId', isAuthenticated, controller.getChannelByUserId)
router.get('/getfollowersByUserId', isAuthenticated, controller.getfollowersByUserId)

router.get('/getPopularChannels', controller.getPopularChannels)
router.get('/getTrendingChannels', controller.getTrendingChannels)


//user post
router.post('/regenerateToken', controller.regenerateToken)
router.post('/postSignup', controller.postSignup)
router.post('/postLogin', controller.postLogin)
router.post('/addMoneyToWallet', isAuthenticated, controller.addMoneyToWallet)
router.post('/withDrawMoneyToWallet', isAuthenticated, controller.withDrawMoneyToWallet)

//user patch
router.patch('/changeChannelName', isAuthenticated, controller.isBlocked, controller.changeChannelName)
router.patch('/changePassword', controller.changePassword)
router.patch('/changeProfileData', isAuthenticated, controller.changeProfileData)
router.patch('/changeProfileImage', isAuthenticated, controller.changeProfileImage)
router.patch('/subscribeToPremium', isAuthenticated, controller.subscribeToPremium)


export default router 