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
}
