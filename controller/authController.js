const express = require("express");
const AuthService = require("../services/authService");
const router = express.Router();

const authService = new AuthService();

router.get("/", (req, res) => {
  try {
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

router.post("/oauth", async (req, res) => {
  try {
    const result = await authService.authenticate(req.body.username, req.body.password);
    console.log(result);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      error: e,
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    console.log(result);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    res.status(200).json({
      status: false,
      data: e,
    });
  }
});

module.exports = router;
