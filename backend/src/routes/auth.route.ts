import express from 'express';
import { verifyJWT } from '../middleware/validate.ts'

const router= express.Router();


router.route('/signup').post();
router.route('/signin').post();
router.route('/logout').post(verifyJWT,);
router.route('/refresh-token').post(verifyJWT,)
router.route('/generate-refresh-access-token')


export default router;