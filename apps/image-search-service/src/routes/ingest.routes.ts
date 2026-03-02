import { Router } from 'express'
import { ingestPhoto, deletePhoto } from '../controllers/ingest.controller'

const router = Router()

router.post('/ingest-photo', ingestPhoto)
router.post('/delete-photo', deletePhoto)

export default router
