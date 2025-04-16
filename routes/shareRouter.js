const { Router } = require("express");
const { viewSharedFolder, viewSharedFolderChild, viewSharedFolderFile } = require("../controllers/shareController");

const shareRouter = Router();

shareRouter.get("/:sharedFolderId", viewSharedFolder);

shareRouter.get("/:sharedFolderId/child/:folderId", viewSharedFolderChild);

shareRouter.get("/:sharedFolderId/files/:fileId", viewSharedFolderFile);

module.exports = shareRouter;