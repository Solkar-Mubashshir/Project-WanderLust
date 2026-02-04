const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")


router.route("/signup")
//signUp Form
.get(userController.renderSignupForm)
//SignUp
.post(
  asyncWrap(userController.signup),
);


router.route("/login")
//Login Form
.get(userController.renderLoginForm)
//Login
.post(
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login,
);



router.get("/logout", userController.logout );

module.exports = router;
