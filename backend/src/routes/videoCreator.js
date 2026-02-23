const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo,saveYoutubeLink,uploadLocalVideo,localVideoUpload} = require("../controllers/videoSection")

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.post("/youtube",adminMiddleware,saveYoutubeLink);
videoRouter.post("/local/:problemId",adminMiddleware,localVideoUpload.single('videoFile'),uploadLocalVideo);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);


module.exports = videoRouter;
