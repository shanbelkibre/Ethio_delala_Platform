"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_controller_1 = require("./agent.controller");
const router = (0, express_1.Router)();
// Public endpoint to retrieve verified agents from database
router.get('/', agent_controller_1.AgentController.getPublicAgents);
exports.default = router;
