const express = require('express');
const aiRouter =  express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const {improveQuestion, suggestCodeTemplates} = require("../controllers/adminAiAssist");

aiRouter.post('/chat', userMiddleware, solveDoubt);

aiRouter.post('/improveqn', improveQuestion);
aiRouter.post('/suggestCodeTemplates', suggestCodeTemplates);

aiRouter.get('/buildRoadmap', userMiddleware);

module.exports = aiRouter;