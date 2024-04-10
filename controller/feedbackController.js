const express = require("express");
const {
    fetchAllData,
    fetchDataById,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const FeedbackService = require("../services/feedbackService");
const router = express.Router();

const feedbackService = new FeedbackService();

router.get("/", async (req, res) => {
    try {
        let data;
        if (req.query.id) {
            data = await fetchDataById(constants.FEEDBACK_TABLE, req.query.id);
        } else {
            data = await fetchAllData(constants.FEEDBACK_TABLE);
        }
        res.status(200).json({
            status: true,
            data: data,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            error: e.toString(),
        });
    }
});

router.post("/", async (req, res) => {
    try {
        let payload = req.body;
        let result = await feedbackService.addFeedback(payload);
        res.status(200).json(result);
    } catch (e) {
        res.status(200).json({
            status: false,
            error: e.toString(),
        });
    }
});

module.exports = router;
