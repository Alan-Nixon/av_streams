import express from 'express' 
import { streamDeleteController, streamGetController, streamPostController,streamPatchController } from '../controller/streamController_Api_gateway'

const streamRouter = express.Router()

streamRouter.get('/:Route', streamGetController)
streamRouter.post("/:Route",streamPostController)
streamRouter.patch('/:Route',streamPatchController)
streamRouter.delete('/:Route',streamDeleteController)
 

export default streamRouter 