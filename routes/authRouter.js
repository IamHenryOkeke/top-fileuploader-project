// routes/authorRouter.js
const { Router } = require("express");
const { userSignUp, userLogout, userLogin } = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) =>  res.render("sign-up"));
authRouter.post("/sign-up", userSignUp);

authRouter.get("/login", (req, res) => {
  const callbackUrl = req.query.callbackUrl || "/";
  let data;
  res.render("login", { callbackUrl, data });
});
authRouter.post("/login",userLogin);

authRouter.get("/logout", userLogout);

module.exports = authRouter;