const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");

//Creating user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      message: "Unable to login!",
    });
  }
});

//Authenticate user
router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

//Logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({
      success: true,
      user: req.user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Unable to Logout!",
    });
  }
});

module.exports = router;
