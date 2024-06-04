import { Router } from "express";
import { isAuthenticated } from 'userauthenticationforavstreams';
import * as controller from '../controllers/controller'
const router = Router()


router.get('/getChatOfUser', isAuthenticated,controller.getChatOfUser)




export default router