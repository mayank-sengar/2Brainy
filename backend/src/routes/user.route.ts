import express from 'express'
import { verifyJWT } from '../middleware/validate'

const router=express.Router();


router.use(verifyJWT);

// router.route('/').get();
// router.route('add').post();
// router.route('delete').delete();
// router.route('update').patch();


export default router