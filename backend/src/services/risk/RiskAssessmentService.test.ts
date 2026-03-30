import { RiskAssessmentService } from './RiskAssessmentService';
import { VitalsLog } from '../../models/VitalsLog';

describe('RiskAssessmentService', () => {
  describe('evaluateVitals', () => {
    it('should return no risk for normal vitals', () => {
      const log = new VitalsLog();
      log.bloodPressure = '120/80';
      log.fetalMovement = 10;
      
      const result = RiskAssessmentService.evaluateVitals(log);
      expect(result.isRisk).toBe(false);
    });

    it('should flag high blood pressure (preeclampsia risk)', () => {
      const log = new VitalsLog();
      log.bloodPressure = '145/95';
      
      const result = RiskAssessmentService.evaluateVitals(log);
      expect(result.isRisk).toBe(true);
      expect(result.severity).toBe('medium');
      expect(result.category).toBe('blood_pressure');
    });

    it('should flag critically high blood pressure', () => {
      const log = new VitalsLog();
      log.bloodPressure = '165/115';
      
      const result = RiskAssessmentService.evaluateVitals(log);
      expect(result.isRisk).toBe(true);
      expect(result.severity).toBe('high');
      expect(result.message).toContain('URGENT');
    });

    it('should flag decreased fetal movement (critical)', () => {
      const log = new VitalsLog();
      log.fetalMovement = 2;
      
      const result = RiskAssessmentService.evaluateVitals(log);
      expect(result.isRisk).toBe(true);
      expect(result.severity).toBe('high');
      expect(result.category).toBe('fetal_movement');
    });

    it('should flag decreased fetal movement (medium)', () => {
      const log = new VitalsLog();
      log.fetalMovement = 5;
      
      const result = RiskAssessmentService.evaluateVitals(log);
      expect(result.isRisk).toBe(true);
      expect(result.severity).toBe('medium');
      expect(result.category).toBe('fetal_movement');
    });
  });

  describe('evaluateTrends', () => {
    it('should flag rapid weight gain', () => {
      const log1 = new VitalsLog();
      log1.weight = 150;
      log1.loggedAt = new Date('2024-03-20T10:00:00Z');

      const log2 = new VitalsLog();
      log2.weight = 153; // +3 lbs
      log2.loggedAt = new Date('2024-03-25T10:00:00Z'); // 5 days later

      const result = RiskAssessmentService.evaluateTrends([log2, log1]);
      expect(result.isRisk).toBe(true);
      expect(result.category).toBe('weight');
      expect(result.severity).toBe('medium');
    });

    it('should flag rising diastolic blood pressure trend', () => {
      const logs = [
        { bloodPressure: '130/85', loggedAt: new Date('2024-03-25T10:00:00Z') },
        { bloodPressure: '125/82', loggedAt: new Date('2024-03-20T10:00:00Z') },
        { bloodPressure: '120/78', loggedAt: new Date('2024-03-15T10:00:00Z') }
      ].map(data => {
        const log = new VitalsLog();
        log.bloodPressure = data.bloodPressure;
        log.loggedAt = data.loggedAt;
        return log;
      });

      const result = RiskAssessmentService.evaluateTrends(logs);
      expect(result.isRisk).toBe(true);
      expect(result.category).toBe('blood_pressure');
      expect(result.severity).toBe('low');
    });
  });
});
