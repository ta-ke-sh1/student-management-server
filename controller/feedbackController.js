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
            console.log("FETCH BY ID");
            data = await fetchDataById(constants.FEEDBACK_TABLE, req.query.id);
        } else {
            data = await fetchAllData(constants.FEEDBACK_TABLE);
        }
        console.log(data);
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

router.get("/course", async (req, res) => {
    try {
        let { course_id } = req.query;
        if (course_id) {
            const data = await feedbackService.fetchFeedbackByCourse(course_id);
            console.log(data)

            res.status(200).json({
                status: true,
                data: data,
            });
        } else {
            throw "Missing parameter";
        }
    } catch (e) {
        res.status(200).json({
            status: false,
            error: e.toString(),
        });
    }
});

router.put("/", async (req, res) => {
    try {
        await feedbackService.editFeedback(req.body.id, req.body.comments)
        res.status(200).json({
            status: true,
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            error: e.toString(),
        });
    }
})

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
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

router.delete("/", async (req, res) => {
    try {
        console.log(req.query.id)
        let result = await feedbackService.deleteFeedback(req.query.id);
        res.status(200).json({
            status: result
        });
    } catch (e) {
        res.status(200).json({
            status: false,
            error: e.toString(),
        });
    }
})

module.exports = router;
