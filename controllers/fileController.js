const { deleteFile, getFileById } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { AppError } = require("../middlewares/errorHandler");


const deleteFileFromFolder = asyncHandler(async(req, res) => {
  const { fileId } = req.params;

  const file = await getFileById(fileId)
  
  if(!file) {
    throw new AppError("Folder not found", 404)
  }
  
  if(file.userId !== req.user.id) {
    throw new AppError("User is mot the owner of the file", 401)
  }
  
  const result = await deleteFile(fileId);
  return res.status(200).redirect(`/folders/${result.folderId}`);
})

module.exports = {
  deleteFileFromFolder
}