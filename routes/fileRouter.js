// routes/authorRouter.js
const { Router } = require("express");
const { getFileById } = require("../db/queries");
const fileRouter = Router();
const path = require("node:path")

fileRouter.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found.");
    }
  });
});

fileRouter.get("/:fileId", async(req, res) =>  {
  const { fileId } = req.params;
  const file = await getFileById(fileId);
  res.render("view-file", { file })
});

module.exports = fileRouter;