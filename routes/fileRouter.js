const { Router } = require("express");
const { getFileById } = require("../db/queries");
const axios = require('axios');
const { AppError } = require("../middlewares/errorHandler");
const { deleteFileFromFolder } = require("../controllers/fileController");

const fileRouter = Router();

fileRouter.get("/download", async(req, res) => {
  const { fileName, filePath } = req.query;

  try {
    const response = await axios({
      url: filePath,
      method: 'GET',
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);

    response.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    throw new AppError("Internal server", 500)
  }
});

fileRouter.get("/:fileId", async(req, res) =>  {
  const { fileId } = req.params;
  const file = await getFileById(fileId);
  if (!file) {
    throw new AppError("File not found", 404)
  }
  res.render("view-file", { file })
});

fileRouter.post("/:fileId/delete", deleteFileFromFolder);

module.exports = fileRouter;