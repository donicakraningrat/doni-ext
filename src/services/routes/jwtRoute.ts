import express, { Router } from 'express';
import { jwtController } from '../controllers/jwtController';

const router: Router = express.Router();

// Login route
router.post('/encoded', jwtController.encoded);
router.post('/decoded', jwtController.decoded);

export default router;
