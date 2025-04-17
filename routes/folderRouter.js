const { Router } = require("express");
const { createNewFolder, deleteUserFolder, updateUserFolder, addFileToFolder, shareUserFolder, unshareUserFolder } = require("../controllers/folderController");
const { getFolderByID, getUserFolders } = require("../db/queries");
const { AppError } = require("../error/errorHandler");

const folderRouter = Router();

folderRouter.get("/create", (req, res) => {res.render("create-folder")});
folderRouter.post("/create", createNewFolder);

folderRouter.get("/:folderId", async(req, res) => {
  const { folderId } = req.params;
  const {path, folder} = await getFolderByID(folderId, req.user.id);

  if (!folder) {
    throw new AppError("Folder not found", 404)
  }

  res.render("view-folder", {folder, path})
});

folderRouter.get("/:folderId/upload-file", (req, res) => {
  const { folderId } = req.params;
  res.render("upload-file", {folderId})
});
folderRouter.post("/:folderId/upload-file", addFileToFolder);

folderRouter.get("/:folderId/add-a-folder", async(req, res) => {
  const { folderId } = req.params;
  res.render("create-folder", {folderId})
});
folderRouter.post("/:folderId/add-a-folder", createNewFolder);

folderRouter.get("/:folderId/share-folder", (req, res) => {
  const { folderId } = req.params;
  let data;
  res.render("share-folder", { folderId, data })
});
folderRouter.post("/:folderId/share-folder", shareUserFolder);
folderRouter.post("/:folderId/unshare-folder", unshareUserFolder);

folderRouter.get("/:folderId/update-folder", async(req, res) => {
  const { folderId } = req.params;
  const { folder } = await getFolderByID(folderId);
  console.log(folder)
  res.render("update-folder", {folder})
});
folderRouter.post("/:folderId/update-folder", updateUserFolder);

folderRouter.post("/:folderId/delete-folder", deleteUserFolder);

folderRouter.get("/", async(req, res) => {
  const folders = await getUserFolders(req.user.id);
  res.render("folders", { folders })
});

module.exports = folderRouter;