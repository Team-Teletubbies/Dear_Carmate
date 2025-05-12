import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import * as dashboardController from '../controllers/dashboardController';

const router = express.Router();

router.get('/', verifyAccessToken, asyncHandler(dashboardController.getDashboardStatsHandler));

export default router;
