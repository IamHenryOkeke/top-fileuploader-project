// routes/authorRouter.js
const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("home");
});

module.exports = indexRouter;