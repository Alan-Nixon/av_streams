import express from 'express' 
import { commentGetController, commentPatchController, commentPostController } from '../controller/commentController_Api_gateway'

const commentRouter = express.Router()

commentRouter.post("/:Route",commentPostController)
commentRouter.patch("/:Route",commentPatchController)
commentRouter.get("/:Route",commentGetController)

export default commentRouter 
  