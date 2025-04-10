const express = require("express");
const path = require("node:path");
const passport = require("passport");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) res.locals.user = req.user;

  console.log(req.user)
  console.log(res.locals.user)
  next();
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Routes
app.use("/auth", authRouter)
app.use("/", indexRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});