const { Router } = require("express");
const { getFileById } = require("../db/queries");
const axios = require('axios');

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
    res.status(500).send('Download failed');
  }
});

fileRouter.get("/:fileId", async(req, res) =>  {
  const { fileId } = req.params;
  const file = await getFileById(fileId);
  res.render("view-file", { file })
});

module.exports = fileRouter;