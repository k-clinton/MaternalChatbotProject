import { VitalsLog } from '../../models/VitalsLog';

export interface RiskAlert {
  isRisk: boolean;
  message: string | null;
  severity: 'low' | 'medium' | 'high';
  category: 'blood_pressure' | 'weight' | 'fetal_movement' | 'symptoms' | 'general';
}

export class RiskAssessmentService {
  /**
   * Evaluates vitals to flag potential baseline risks like preeclampsia 
   * (High BP reading) or abnormal fetal movement checks.
   */
  public static evaluateVitals(log: VitalsLog): RiskAlert {
    // 1. Blood Pressure Analysis (Preeclampsia Risk)
    if (log.bloodPressure) {
      const parts = log.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0], 10);
        const diastolic = parseInt(parts[1], 10);

        // Severe Preeclampsia Thresholds
        if (systolic >= 160 || diastolic >= 110) {
          return {
            isRisk: true,
            severity: 'high',
            category: 'blood_pressure',
            message: 'URGENT: Your blood pressure is critically high (Stage 2 Hypertension/Severe Preeclampsia range). Please contact your healthcare provider or go to the nearest emergency room immediately.'
          };
        }

        // Preeclampsia Thresholds
        if (systolic >= 140 || diastolic >= 90) {
          return {
            isRisk: true,
            severity: 'medium',
            category: 'blood_pressure',
            message: 'Your blood pressure is elevated. This could be a sign of gestational hypertension or preeclampsia. Please contact your provider today for further evaluation.'
          };
        }
      }
    }

    // 2. Fetal Movement Analysis
    if (log.fetalMovement !== null && log.fetalMovement !== undefined) {
      if (log.fetalMovement < 3) {
        return {
          isRisk: true,
          severity: 'high',
          category: 'fetal_movement',
          message: 'CRITICAL: Very low fetal movement detected. Please perform a kick count immediately. If you do not feel 10 movements within 2 hours, contact your provider or go to labor and delivery immediately.'
        };
      }
      if (log.fetalMovement < 6) {
        return {
          isRisk: true,
          severity: 'medium',
          category: 'fetal_movement',
          message: 'Decreased fetal movement noted. Try drinking something cold and lying on your left side. Monitor closely and contact your provider if movement doesn\'t increase.'
        };
      }
    }

    return { isRisk: false, message: null, severity: 'low', category: 'general' };
  }

  /**
   * Evaluates trends across multiple vitals logs to detect gradual issues.
   */
  public static evaluateTrends(logs: VitalsLog[]): RiskAlert {
    if (logs.length < 2) return { isRisk: false, message: null, severity: 'low', category: 'general' };

    // Sort logs by date descending (latest first)
    const sortedLogs = [...logs].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
    const latest = sortedLogs[0];
    const previous = sortedLogs[1];

    // 1. Rapid Weight Gain Analysis (Sign of edema/preeclampsia)
    if (latest.weight && previous.weight) {
      const weightDiff = latest.weight - previous.weight;
      const timeDiff = latest.loggedAt.getTime() - previous.loggedAt.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      // If gain is > 2lbs and occurred within a short window (1 to 7 days)
      if (weightDiff >= 2 && daysDiff <= 7 && daysDiff >= 0.5) {
        return {
          isRisk: true,
          severity: 'medium',
          category: 'weight',
          message: `Noticeable rapid weight gain of ${weightDiff.toFixed(1)} lbs in ${Math.round(daysDiff)} days. This can sometimes indicate sudden fluid retention associated with preeclampsia. Please monitor for swelling in your face or hands.`
        };
      }
    }

    // 2. Rising Blood Pressure Trend
    if (sortedLogs.length >= 3) {
      const diastolicTrend = sortedLogs.slice(0, 3).map(l => {
        if (!l.bloodPressure) return null;
        const parts = l.bloodPressure.split('/');
        return parts.length === 2 ? parseInt(parts[1], 10) : null;
      }).filter((v): v is number => v !== null);

      if (diastolicTrend.length === 3 && diastolicTrend[0] > diastolicTrend[1] && diastolicTrend[1] > diastolicTrend[2]) {
        return {
          isRisk: true,
          severity: 'low',
          category: 'blood_pressure',
          message: 'Your diastolic blood pressure shows a steady upward trend. While not currently in the risk zone, please mention this trend at your next prenatal visit.'
        };
      }
    }

    return { isRisk: false, message: null, severity: 'low', category: 'general' };
  }
}
