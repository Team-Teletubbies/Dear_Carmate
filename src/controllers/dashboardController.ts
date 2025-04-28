import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getDashboardStatsHandler = async (req: Request, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const stats = await dashboardService.getDashboardStats(companyId);
  res.status(200).json(stats);
};
