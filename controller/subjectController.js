const express = require("express");
const SubjectService = require("../services/subjectService");
const router = express.Router();

const subjectService = new SubjectService();

router.get("/", (req, res) => { });

router.post("/", async (req, res) => {
    console.log(req.body)
    let result = await subjectService.addSubject(req.body)
    res.status(200).json(result)
});

router.delete("/", async (req, res) => {
    let id = req.query.id
    let result = await subjectService.deleteSubject(id)
    res.status(200).json(result)
});

router.put("/", async (req, res) => {
    let id = req.query.id
    let result = await subjectService.editSubject(id, req.body)
    res.status(200).json(result)
});

module.exports = router;
