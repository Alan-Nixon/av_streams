import express from 'express';
const router = express.Router()
import * as controller from '../controllers/userController'

import { isAuthenticated } from "userauthenticationforavstreams"


//user get
router.get('/userDetails', isAuthenticated, controller.userDetails)
router.get('/getWalletDetails', isAuthenticated, controller.getWalletDetails)
router.get('/isPremiumUser', isAuthenticated, controller.isPremiumUser)
router.get('/isFollowing', isAuthenticated, controller.isFollowing)
router.get('/followChannel', isAuthenticated, controller.followChannel)
router.get('/getChannelById', isAuthenticated, controller.getChannelById)
router.get('/getChannelByUserId', isAuthenticated, controller.getChannelByUserId)
router.get('/getfollowersByUserId', isAuthenticated, controller.getfollowersByUserId)
router.get('/getUserById', isAuthenticated, controller.getUserById);
router.get('/getSubscriptionDetails', isAuthenticated, controller.getSubscriptionDetails)

router.get('/sendOtp', controller.sendOtp)
router.get('/isUserAuth', controller.authenticated)
router.get('/forgetPasswordOtpSend', controller.forgetPasswordOtpSend)
router.get('/getPopularChannels', controller.getPopularChannels)
router.get('/getTrendingChannels', controller.getTrendingChannels)

//user post
router.post('/regenerateToken', controller.regenerateToken)
router.post('/postSignup', controller.postSignup)
router.post('/postLogin', controller.postLogin)
router.post('/addMoneyToWallet', isAuthenticated, controller.addMoneyToWallet)
router.post('/withDrawMoneyToWallet', isAuthenticated, controller.withDrawMoneyToWallet)
router.post('/getNewChats', isAuthenticated, controller.getNewChats)

//user patch
router.patch('/changeChannelName', isAuthenticated, controller.changeChannelName)
router.patch('/changePassword', controller.changePassword)
router.patch('/changeProfileData', isAuthenticated, controller.changeProfileData)
router.patch('/changeProfileImage', isAuthenticated, controller.changeProfileImage)
router.patch('/subscribeToPremium', isAuthenticated, controller.subscribeToPremium)


export default router 