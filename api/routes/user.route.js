import express from 'express';
import { getApiStatus } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/status', getApiStatus);

export default router;