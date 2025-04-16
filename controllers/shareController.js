const { getFileById, getSharedFolderById, getFolderByID } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { AppError } = require("../middlewares/errorHandler");
const { isDescendant } = require("../utils/isDescendant");

const viewSharedFolder = asyncHandler(async(req, res) => {
  const { sharedFolderId } = req.params;

  const sharedFolder = await getSharedFolderById(sharedFolderId);

  if (!sharedFolder.Folder) {
    throw new AppError("Folder not found", 404)
  }

  const hasExpired = new Date() > sharedFolder.expiresAt

  if (hasExpired) {
    throw new AppError("Shared folder has expired", 400)
  }
  res.status(200).render("view-sharedfolder", { folder: sharedFolder.Folder, sharedId: sharedFolder.id })
})

const viewSharedFolderChild = asyncHandler(async (req, res) => {
  const { sharedFolderId, folderId } = req.params;

  const shared = await getSharedFolderById(sharedFolderId);
  
  if (!shared) {
    throw new AppError("Invalid shared link", 404);
  }

  const isChild = await isDescendant(shared.Folder.id, folderId);

  if (!isChild) {
    throw new AppError("Access denied", 403);
  }

  const { folder } = await getFolderByID(folderId);


  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  res.status(200).render("view-sharedfolder", { folder, sharedId: sharedFolderId });
});

const viewSharedFolderFile = asyncHandler(async (req, res) => {
  const { sharedFolderId, fileId } = req.params;

  const file = await getFileById(fileId)

  const shared = await getSharedFolderById(sharedFolderId);

  if (!shared) {
    throw new AppError("Invalid shared link", 404);
  }

  const isChild = await isDescendant(shared.Folder.id, file.Folder.id);

  if (!isChild) {
    throw new AppError("Access denied", 403);
  }

  if (!file) {
    throw new AppError("Folder not found", 404);
  }

  res.status(200).render("view-sharedfile", {
    file
  });
});


module.exports = {
  viewSharedFolder,
  viewSharedFolderChild,
  viewSharedFolderFile
}