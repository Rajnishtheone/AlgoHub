const express = require('express');
const aiRouter =  express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const {improveQuestion, suggestCodeTemplates, problemAssistant} = require("../controllers/adminAiAssist");
const { buildRoadmap } = require("../controllers/roadmapAi");

aiRouter.post('/chat', userMiddleware, solveDoubt);

aiRouter.post('/improveqn', improveQuestion);
aiRouter.post('/suggestCodeTemplates', suggestCodeTemplates);
aiRouter.post('/problem-assistant', adminMiddleware, problemAssistant);

aiRouter.post('/buildRoadmap', userMiddleware, buildRoadmap);

module.exports = aiRouter;
