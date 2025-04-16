const { body, validationResult } = require("express-validator");
const { createFolder, deleteFolder, getFolderByID, updateFolder, createFile, shareFolder, unshareFolder } = require("../db/queries");
const asyncHandler = require("express-async-handler");
const upload = require("../config/multer");
const { AppError } = require("../middlewares/errorHandler");

const validateFolderFormBody = [
  body("name").trim()
    .isAlpha('en-US', { ignore: ' ' }).withMessage('Folder name must contain only letters')
    .isLength({ min: 3 }).withMessage("Folder name must be at least 3 characters long"),
];

const validateShareFolderFormBody = [
  body("duration")
    .isInt({ min: 3 }).withMessage("Duration must be at least 3 days"),
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
    res.status(200).redirect(`/folders/${folderId}`);
  })
] 

const updateUserFolder = [
  validateFolderFormBody,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);
    const { folderId } =  req.params;
    const { folder } = await getFolderByID(folderId);

    if (!errors.isEmpty()) {
      return res.status(400).render("update-folder", {
        errors: errors.array(),
        data: req.body,
        folder
      });
    }

    const { name } = req.body;
  
    if(folder.userId !== req.user.id) {
      throw new AppError("User is mot the owner of the folder", 400)
    }

    await updateFolder(folderId, name, req.user.id);
    res.status(200).redirect(`/folders/${folderId}`);
  })
]

const deleteUserFolder = asyncHandler(async(req, res) => {
  const { folderId } = req.params;

  const { folder } = await getFolderByID(folderId);

  if(!folder) {
    throw new AppError("Folder not found", 404)
  }

  if(folder.userId !== req.user.id) {
    throw new AppError("User is mot the owner of the folder", 400)
  }

  const url = folder.parentId ? `/folders/${folder.parentId}` : "/folders"

  await deleteFolder(folderId, req.user.id);
  return res.status(200).redirect(url);
})

const shareUserFolder = [
  validateShareFolderFormBody,
  asyncHandler(async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("share-folder", {
        errors: errors.array(),
        data: req.body,
        folderId: req.params.folderId
      });
    }

    const { folderId } = req.params;
    const { duration } = req.body;

    const folder = await getFolderByID(folderId);

    if (!folder) {
      throw new AppError("Folder not found", 404)
    }

    const durationInDays = Number(duration);
    const now = new Date();
    const formattedDuration = new Date(now.getTime() +(durationInDays * 24 * 60 * 60 * 1000));

    await shareFolder(folderId, req.user.id, formattedDuration);
    res.status(200).redirect(`/folders/${folderId}`);
   })
]

const unshareUserFolder = asyncHandler(async(req, res) => {
  const folderId = req.params.folderId;

  const folder = await getFolderByID(folderId);

  if (!folder) {
    throw new AppError("Folder not found", 404)
  }

  await unshareFolder(folderId, req.user.id);
  res.status(200).redirect(`/folders/${folderId}`);
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
  unshareUserFolder,
  shareUserFolder,
  updateUserFolder,
  addFileToFolder,
}