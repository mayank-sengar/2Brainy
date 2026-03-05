import express from 'express';
import { verifyJWT } from '../middleware/validate'
import { signUp,signIn,tokenRefresh}  from '../controllers/auth.controller'
const router= express.Router();


router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
// router.route('/logout').post(verifyJWT,);
router.route('/refresh-token').get(tokenRefresh)
// router.route('/generate-refresh-access-token')


export default router;