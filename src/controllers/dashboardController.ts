import { Response } from 'express';
import * as dashboardService from '../services/dashboardService';
import { AuthenticatedRequest } from '../types/express';

export const getDashboardStatsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const stats = await dashboardService.getDashboardStats(companyId);
  res.status(200).json(stats);
};
