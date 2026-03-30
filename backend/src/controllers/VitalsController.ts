import { Response } from 'express';
import dataSource from '../database/data-source';
import { VitalsLog } from '../models/VitalsLog';
import { User } from '../models/User';
import { RiskAssessmentService } from '../services/risk/RiskAssessmentService';
import { NotificationService } from '../services/NotificationService';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class VitalsController {
  private static vitalsRepository = dataSource.getRepository(VitalsLog);
  private static userRepository = dataSource.getRepository(User);

  public static async logVitals(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { bloodPressure, weight, fetalMovement } = req.body;

      const log = VitalsController.vitalsRepository.create({
        userId,
        bloodPressure,
        weight,
        fetalMovement
      });

      await VitalsController.vitalsRepository.save(log);
      
      // Real-time risk assessment
      const baselineAlert = RiskAssessmentService.evaluateVitals(log);
      
      // Trend analysis
      const userLogs = await VitalsController.vitalsRepository.find({
        where: { userId },
        order: { loggedAt: 'DESC' },
        take: 5
      });
      const trendAlert = RiskAssessmentService.evaluateTrends(userLogs);

      // Prioritize high severity alerts
      let finalAlert = baselineAlert.isRisk ? baselineAlert : trendAlert;
      if (trendAlert.isRisk && trendAlert.severity === 'high' && baselineAlert.severity !== 'high') {
        finalAlert = trendAlert;
      }

      // Trigger urgency notifications if severity is high
      if (finalAlert.isRisk && finalAlert.severity === 'high' && finalAlert.message) {
        const user = await VitalsController.userRepository.findOneBy({ id: userId });
        if (user) {
          NotificationService.sendUrgencyAlert(user, finalAlert.message).catch(err => 
            console.error('Error sending urgency alert from vitals log:', err)
          );
        }
      }

      return res.status(201).json({ log, alert: finalAlert });
    } catch (error) {
      console.error('VitalsController logVitals error:', error);
      return res.status(500).json({ error: 'Failed to save vitals log' });
    }
  }

  public static async getLogs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      
      const logs = await VitalsController.vitalsRepository.find({
        where: { userId },
        order: { loggedAt: 'DESC' },
        take: 20
      });
      
      return res.status(200).json(logs);
    } catch (error) {
      console.error('VitalsController getLogs error:', error);
      return res.status(500).json({ error: 'Failed to fetch vitals logs' });
    }
  }

  public static async getAlerts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      
      const logs = await VitalsController.vitalsRepository.find({
        where: { userId },
        order: { loggedAt: 'DESC' },
        take: 10
      });

      const baselineAlerts = logs
        .map(log => RiskAssessmentService.evaluateVitals(log))
        .filter(alert => alert.isRisk)
        .map((alert, index) => ({
          id: `baseline-alert-${index}`,
          type: "warning",
          title: alert.message?.includes('blood pressure') ? 'Elevated Blood Pressure' : 
                 alert.message?.includes('fetal movement') ? 'Low Fetal Movement' : 'Health Alert',
          message: alert.message || '',
          time: logs[index]?.loggedAt ? new Date(logs[index].loggedAt).toLocaleString() : 'Recently'
        }));

      // Detect trends in the fetched logs
      const trendAlert = RiskAssessmentService.evaluateTrends(logs);
      const trendAlerts = trendAlert.isRisk ? [{
        id: `trend-alert-0`,
        type: "info", // Trend alerts can be info or warning
        title: trendAlert.message?.includes('weight') ? 'Rapid Weight Gain' : 'Health Trend Alert',
        message: trendAlert.message || '',
        time: 'Recently'
      }] : [];

      return res.status(200).json([...baselineAlerts, ...trendAlerts]);
    } catch (error) {
      console.error('VitalsController getAlerts error:', error);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }
}
