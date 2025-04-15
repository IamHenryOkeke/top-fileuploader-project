const { getSharedFolderById } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { AppError } = require("../middlewares/errorHandler");


const viewSharedFolder = asyncHandler(async(req, res) => {
  const { sharedFolderId } = req.params;

  const folder = await getSharedFolderById(sharedFolderId);

  if (!folder) {
    throw new AppError("Folder not found", 404)
  }

  res.status(200).render("", { folder })
})

module.exports = {
  viewSharedFolder
}