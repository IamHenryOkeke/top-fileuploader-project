const { body, validationResult } = require("express-validator");
const { addNewUser, getUserByEmail, createFolder } = require("../db/queries");
const passwordUtils = require("../utils/passwordUtils");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

const validateUserSignUp = [
  body("name").trim()
    .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must contain only letters')
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  
  body("email").trim()
    .isEmail().withMessage('Email is required and must be a valid email'),

  body("password").trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

  body("confirmPassword").trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const userSignUp = [
  validateUserSignUp,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: errors.array(),
        data: req.body
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await getUserByEmail(email.toLowerCase());

    if (existingUser) {
      return res.status(400).render("sign-up", {
        errors: [{ msg: "Email already used. Please use another email." }],
        data: req.body
      });
    }

    const hashedPassword = await passwordUtils.genPassword(password);

    const values = {
      name,
      email: email.toLowerCase(), 
      password: hashedPassword
    };

    const result = await addNewUser(values);

    const folderName = result.email.split("@")[0];
    await createFolder(folderName, null, result.id);

    res.status(200).redirect("login");
  })
] 

const userLogin = (req, res, next) => {
  const callbackUrl = req.query.callbackUrl || "/";

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).render("login", {
        errors: [{ msg: "Invalid credentials" }],
        callbackUrl,
        data: req.body
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect(callbackUrl);
    });
  })(req, res, next);
}


const userLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
}

module.exports = {
  userSignUp,
  userLogout,
  userLogin
}