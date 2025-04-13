const { body, validationResult } = require("express-validator");
const { createFolder, deleteFolder, getFolderByID, updateFolder, createFile } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const upload = require("../config/multer");

const validateFolderFormBody = [
  body("name").trim()
    .isAlpha('en-US', { ignore: ' ' }).withMessage('Folder name must contain only letters')
    .isLength({ min: 3 }).withMessage("Folder name must be at least 3 characters long"),
];

const createNewFolder = [
  validateFolderFormBody,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("create-folder", {
        errors: errors.array(),
        data: req.body
      });
    }

    const { name } = req.body;
    const { folderId } = req.params;

    await createFolder(name, folderId, req.user.id);
    res.status(200).redirect("/folders");
  })
] 

const updateUserFolder = [
  validateFolderFormBody,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    const { folderId } =  req.params;
    const folder = await getFolderByID(folderId);

    if (!errors.isEmpty()) {
      return res.status(400).render("update-folder", {
        errors: errors.array(),
        data: req.body,
        folder
      });
    }

    const { name } = req.body;

    await updateFolder(folderId, name, req.user.id);
    res.status(200).redirect("/folders");
  })
]

const deleteUserFolder = asyncHandler(async(req, res) => {
  const { folderId } = req.params;

  const existingFolder = await getFolderByID(folderId);

  if (existingFolder) {
    await deleteFolder(folderId, req.user.id);
    return res.status(200).redirect("/folders");
  }
  res.status(400).json({
    error: "Folder not found"
  })
})

const addFileToFolder = [
  upload.single('file'),
  asyncHandler(async(req, res) => {
    const { folderId } = req.params;
    const { originalname, mimetype, size, path } = req.file;
    const payload = {
      name: originalname,
      mimeType: mimetype,
      size,
      url: path,
      userId: req.user.id,
      folderId: folderId
    }
    await createFile(payload)
    res.redirect(`/folders/${folderId}`)
})]

module.exports = {
  createNewFolder,
  deleteUserFolder,
  updateUserFolder,
  addFileToFolder
}