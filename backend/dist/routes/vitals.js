"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vitalsRouter = void 0;
const express_1 = require("express");
const VitalsController_1 = require("../controllers/VitalsController");
const router = (0, express_1.Router)();
exports.vitalsRouter = router;
router.post('/log', VitalsController_1.VitalsController.logVitals);
router.get('/', VitalsController_1.VitalsController.getLogs);
//# sourceMappingURL=vitals.js.map