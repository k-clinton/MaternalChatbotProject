import { VitalsLog } from '../../models/VitalsLog';

export class RiskAssessmentService {
  /**
   * Evaluates vitals to flag potential baseline risks like preeclampsia 
   * (High BP reading) or abnormal fetal movement checks.
   */
  public static evaluateVitals(log: VitalsLog): { isRisk: boolean; message: string | null } {
    if (log.bloodPressure) {
      const parts = log.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0], 10);
        const diastolic = parseInt(parts[1], 10);

        if (systolic >= 140 || diastolic >= 90) {
          return {
            isRisk: true,
            message: 'Your blood pressure is elevated. Please contact your healthcare provider for guidance, as this could be an early sign of preeclampsia.'
          };
        }
      }
    }

    if (log.fetalMovement !== null && log.fetalMovement !== undefined) {
      // Under 10 movements in 2 hours is often a general threshold, 
      // but if we assume the user logs kicks over a short period:
      if (log.fetalMovement < 3) {
        return {
          isRisk: true,
          message: 'Decreased fetal movement detected. Drink something cold and do a kick count. If movement does not increase, contact your provider.'
        };
      }
    }

    return { isRisk: false, message: null };
  }

  /**
   * Evaluates trends across multiple vitals logs to detect gradual issues.
   */
  public static evaluateTrends(logs: VitalsLog[]): { isRisk: boolean; message: string | null } {
    if (logs.length < 2) return { isRisk: false, message: null };

    // Sort logs by date descending (latest first)
    const sortedLogs = [...logs].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
    const latest = sortedLogs[0];
    const previous = sortedLogs[1];

    // 1. Rapid Weight Gain Analysis (More than 2 lbs in a week)
    if (latest.weight && previous.weight) {
      const weightDiff = latest.weight - previous.weight;
      const daysDiff = (latest.loggedAt.getTime() - previous.loggedAt.getTime()) / (1000 * 3600 * 24);
      
      // If gain is > 2lbs and occurred within 7 days
      if (weightDiff >= 2 && daysDiff <= 7) {
        return {
          isRisk: true,
          message: `We've noticed a rapid weight gain of ${weightDiff.toFixed(1)} lbs in ${Math.round(daysDiff)} days. This can sometimes be a sign of fluid retention. Please monitor for swelling or headaches and inform your provider.`
        };
      }
    }

    // 2. Rising Blood Pressure Trend (3 consecutive increases)
    if (sortedLogs.length >= 3) {
      const bpHistory = sortedLogs.slice(0, 3).map(l => {
        if (!l.bloodPressure) return null;
        const parts = l.bloodPressure.split('/');
        return parts.length === 2 ? parseInt(parts[1], 10) : null; // Tracking diastolic trend
      }).filter((v): v is number => v !== null);

      if (bpHistory.length === 3 && bpHistory[0] > bpHistory[1] && bpHistory[1] > bpHistory[2]) {
        return {
          isRisk: true,
          message: 'Your diastolic blood pressure has been steadily increasing over your last three logs. While not yet critical, this trend warrants a discussion with your care provider.'
        };
      }
    }

    return { isRisk: false, message: null };
  }
}
