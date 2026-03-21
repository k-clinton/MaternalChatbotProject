"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalsController = void 0;
const data_source_1 = __importDefault(require("../database/data-source"));
const VitalsLog_1 = require("../models/VitalsLog");
const RiskAssessmentService_1 = require("../services/risk/RiskAssessmentService");
class VitalsController {
    static async logVitals(req, res) {
        try {
            const userId = req.headers['x-user-id'] || 'test-user-id';
            const { bloodPressure, weight, fetalMovement } = req.body;
            const log = VitalsController.vitalsRepository.create({
                userId,
                bloodPressure,
                weight,
                fetalMovement
            });
            await VitalsController.vitalsRepository.save(log);
            // Simple real-time baseline risk assessment
            const riskAlert = RiskAssessmentService_1.RiskAssessmentService.evaluateVitals(log);
            return res.status(201).json({ log, alert: riskAlert });
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to save vitals log' });
        }
    }
    static async getLogs(req, res) {
        try {
            const userId = req.headers['x-user-id'] || 'test-user-id';
            const logs = await VitalsController.vitalsRepository.find({
                where: { userId },
                order: { loggedAt: 'DESC' },
                take: 10
            });
            return res.status(200).json(logs);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to fetch vitals logs' });
        }
    }
}
exports.VitalsController = VitalsController;
VitalsController.vitalsRepository = data_source_1.default.getRepository(VitalsLog_1.VitalsLog);
//# sourceMappingURL=VitalsController.js.map