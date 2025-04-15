const { Router } = require("express");
const { viewSharedFolder } = require("../controllers/shareController");

const shareRouter = Router();

shareRouter.get("/:sharedFolderId", viewSharedFolder);

module.exports = shareRouter;