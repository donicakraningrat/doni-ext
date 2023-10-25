import express, { Router } from 'express';
import { mySqlCtrl } from '../controllers/mySqlCtrl';

const router: Router = express.Router();

// Login route
router.post('/query', mySqlCtrl.query);

export default router;
