const User = require("../models/user.js");

module.exports.getSignupUser = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignupUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust...");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.getLoginUser = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLoginUser = async (req, res) => {
  req.flash("success", "Successfully Logged!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Successfully Logout!");
  res.redirect("/listings");
};
