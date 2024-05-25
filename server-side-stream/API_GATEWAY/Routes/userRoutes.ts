import express from 'express'
import { userManagement_Patch, userManagement_Post, userManagement_get } from '../controller/userController_Api_gateway'

const router = express.Router()

router.get("/:Route", userManagement_get)
router.post("/:Route",userManagement_Post)
router.patch("/:Route",userManagement_Patch)

export default router
