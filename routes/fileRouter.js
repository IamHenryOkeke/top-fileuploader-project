// routes/authorRouter.js
const { Router } = require("express");
const { getFileById } = require("../db/queries");
const fileRouter = Router();
const https = require("node:https")

fileRouter.get("/download", (req, res) => {
  const { fileName, filePath } = req.query;

  https.get(filePath, (fileRes) => {
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", fileRes.headers["content-type"]);
    
    // Pipe the remote file to the response stream
    fileRes.pipe(res);
  }).on("error", (err) => {
    console.error("Download error:", err);
    res.status(500).send("Failed to download file.");
  });
});

fileRouter.get("/:fileId", async(req, res) =>  {
  const { fileId } = req.params;
  const file = await getFileById(fileId);
  res.render("view-file", { file })
});

module.exports = fileRouter;