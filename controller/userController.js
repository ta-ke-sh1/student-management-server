const express = require("express");
const router = express.Router();

const AES = require("crypto-js/aes");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { UserService } = require("../services/userService");
const { GradingService } = require("../services/gradingService");

const userService = new UserService();
const gradingService = new GradingService();

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        var dir = path.resolve() + "\\asset\\avatar\\" + req.query.username ? req.query.username + "\\" : "";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      } catch (e) {
        console.log(e);
      }
    },
    filename: function (req, file, cb) {
      cb(null, "avatar.jpg");
    },
  }),
});

router.get("/", async (req, res) => {
  try {
    let id = req.query.id
    const user = await userService.fetchUserById(id);
    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("all");
    console.log(users.length)
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
})

router.get("/admins", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("admin");
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("/lecturers", async (req, res) => {
  try {
    let users = []
    let dept = req.query.department;
    if (dept) {
      users = await userService.fetchAllLecturersByDepartment(dept);
    } else {
      users = await userService.fetchAllUsers("lecturer");
    }
    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("/students", async (req, res) => {
  try {
    const users = await userService.fetchAllUsers("student");
    res.status(200).json({
      status: true,
      data: users ?? [],
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("/deactivate", async (req, res) => {
  try {
    await userService.deactivateUser(req.query.id);
    res.status(200).send(users);
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.put("/avatar", uploader.single("avatar"), async (req, res) => {
  try {
    res.status(200).json({
      status: true,
      data: "Success",
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
    await userService.addUser(req.body);
    res.status(200).json({ status: true });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.delete("/", (req, res) => {
  try {
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.put("/password", async (req, res) => {
  try {
    const id = req.query.id;
    const role = req.query.role
    console.log(id + "-" + role)
    console.log("Role is: " + role)
    await userService.resetPassword(id, role)
    res.status(200).json({ status: true })
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString()
    })
  }
})

router.put("/", async (req, res) => {
  try {
    const id = req.query.id;
    const update_obj = req.body;
    await userService.editUser(id, update_obj);
    res.status(200).json({ status: true });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e.toString(),
    });
  }
});

router.get("/grade", async (req, res) => {
  try {
    let data = await gradingService.fetchAllGrades();
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

router.get("/grade/all", async (req, res) => {
  try {
    let data = await gradingService.fetchAllGradesByStudentId(req.query);
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

router.get("/grade/group", async (req, res) => {
  try {
    let data = await gradingService.fetchAllGradesByStudentIdAndSemester(req.query);
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

router.get("/grade/semester", async (req, res) => {
  try {
    let data = await gradingService.fetchAllGradesByStudentIdAndTermAndProgrammeAndDepartmentAndGroup(req.query);
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

router.get("/curriculum", async (req, res) => {
  try {
    console.log(req.query.id)
    let data = await userService.fetchUserCurricullum(req.query.id);
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

module.exports = router;
