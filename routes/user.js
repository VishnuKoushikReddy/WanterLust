const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Get SignUp
// Post SignUp
router
  .route("/signup")
  .get(userController.getSignupUser)
  .post(wrapAsync(userController.postSignupUser));

//Get Login
//Post Login
router
  .route("/login")
  .get(userController.getLoginUser)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLoginUser
  );

// Logout
router.get("/logout", userController.Logout);

module.exports = router;
