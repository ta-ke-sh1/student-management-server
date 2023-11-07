const express = require("express");
const SubjectService = require("../services/subjectService");
const router = express.Router();

const subjectService = new SubjectService();

router.get("/", async (req, res) => {
  try {
    let data = [];
    console.log("Department is: " + req.query.department);
    if (req.query.department) {
      data = await subjectService.fetchAllSubjectsByDepartment(req.query.department);
    } else {
      data = await subjectService.fetchAllSubjects();
    }
    res.status(200).json({
      status: true,
      data: data,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let result = await subjectService.addSubject(req.body);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    let id = req.query.id;
    console.log(id);
    let result = await subjectService.deleteSubject(id);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.put("/", async (req, res) => {
  try {
    let id = req.query.id;
    console.log(id)
    console.log(req.body)
    let result = await subjectService.editSubject(id, req.body);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

module.exports = router;
