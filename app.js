const express = require("express");
const path = require("node:path");
const expressSession = require('express-session');
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const { isAuth } = require("./middlewares/authMiddleware");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");

require('./config/passport');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
  cookie: {
   maxAge: 20 * 60 * 1000 // ms
  },
  secret: "it's our secret",
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined
    }
  )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) res.locals.user = req.user;
  next();
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", isAuth, authRouter)
app.use("/files", isAuth, fileRouter)
app.use("/folders", isAuth, folderRouter)
app.use("/", indexRouter)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const data = {
    statusCode: err.statusCode,
    message: err.message || "Something went wrong",
  }
  res.status(err.statusCode || 500).render("error-view", { data });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});