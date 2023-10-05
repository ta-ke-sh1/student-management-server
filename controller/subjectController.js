const express = require("express");
const SubjectService = require("../services/subjectService");
const router = express.Router();

const subjectService = new SubjectService();

router.get("/", (req, res) => {
  try {
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    let result = await subjectService.addSubject(req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    let id = req.query.id;
    let result = await subjectService.deleteSubject(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    let id = req.query.id;
    let result = await subjectService.editSubject(id, req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

module.exports = router;
