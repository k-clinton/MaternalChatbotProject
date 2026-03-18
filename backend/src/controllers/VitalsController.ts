import { Request, Response } from 'express';
import dataSource from '../database/data-source';
import { VitalsLog } from '../models/VitalsLog';
import { RiskAssessmentService } from '../services/risk/RiskAssessmentService';

export class VitalsController {
  private static vitalsRepository = dataSource.getRepository(VitalsLog);

  public static async logVitals(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
      const { bloodPressure, weight, fetalMovement } = req.body;

      const log = VitalsController.vitalsRepository.create({
        userId,
        bloodPressure,
        weight,
        fetalMovement
      });

      await VitalsController.vitalsRepository.save(log);

      // Simple real-time baseline risk assessment
      const riskAlert = RiskAssessmentService.evaluateVitals(log);

      return res.status(201).json({ log, alert: riskAlert });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save vitals log' });
    }
  }

  public static async getLogs(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
      
      const logs = await VitalsController.vitalsRepository.find({
        where: { userId },
        order: { loggedAt: 'DESC' },
        take: 10
      });
      
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vitals logs' });
    }
  }
}
