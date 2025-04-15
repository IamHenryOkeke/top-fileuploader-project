const { AppError } = require("../middlewares/errorHandler");
const prisma = require("../prisma");

async function addNewUser(values) {
  const { name, email, password } = values;
  try {
    const data = await prisma.user.create({
      data: values
    })
    return data;
  } catch (error) {
    console.error("Error inserting new user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}


async function getUserByEmail(email) {
  try {
    const data = await prisma.user.findUnique({
      where: { email }
    })

    return data;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function getUserByID(id) {
  try {
    const data = await prisma.user.findUnique({
      where: { id }
    })

    return data;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function createFolder(folderName, folderId, userId) {
  try {
    const data = await prisma.folder.create({
      data: {
        name: folderName,
        userId,
        ...(folderId && { parentId: folderId})
      }
    })
    return data;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function deleteFolder(folderId, userId) {
  try {
    const data = await prisma.folder.delete({
      where: {
        id: folderId,
        userId
      }
    })
    return data;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function updateFolder(folderId, folderName, userId) {
  try {
    const data = await prisma.folder.update({
      where: { id: folderId, userId },
      data: {
        name: folderName
      }
    })
    return data;
  } catch (error) {
    console.error("Error updating folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function shareFolder(folderId, userId, expiresAt) {
  try {
    const data = await prisma.sharedFolder.create({
      data: {
        folderId,
        userId,
        expiresAt
      }
    })
    return data;
  } catch (error) {
    console.error("Error sharing folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function unshareFolder(folderId, userId) {
  try {
    const data = await prisma.sharedFolder.delete({
      where: {
        folderId,
        userId
      }
    })
    return data;
  } catch (error) {
    console.error("Error deleting folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function getAllFolders() {
  try {
    const data = await prisma.folder.findMany({
      where: {
        parentId: null
      }
    })
    return data;
  } catch (error) {
    console.error("Error finding folders:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function getFolderByID(folderId) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        children: true,
        files: true,
        SharedFolder: {
          select: {
            id: true
          }
        },
        parent: {
          include: {
            parent: {
              include: {
                parent: true, // you can keep nesting if needed
              },
            },
          },
        },
      },
    });
  
    const path = [];
    let current = folder;
    while (current?.parent) {
      current = await prisma.folder.findUnique({
        where: { id: current.parentId },
      });
      if (current) path.unshift(current);
    }
  
    return { folder, path };
  } catch (error) {
    console.error("Error finding folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function getFolderBySlug(slug) {
  try {
    const data = await prisma.folder.findUnique({
      where: { slug }
    })
    return data;
  } catch (error) {
    console.error("Error finding folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function createFile(values) {
  try {
    const { name, mimeType, size, url, userId, folderId } = values;
    const data = await prisma.file.create({
      data: {
        name,
        size,
        mimeType,
        folderId,
        url,
        userId
      }
    })
    return data;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

async function getFileById(id) {
  try {
    const data = await prisma.file.findUnique({
      where: {
        id
      }
    })
    return data;
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw new AppError("Internal server error", 500)
  }
}


async function getSharedFolderById(id) {
  try {
    const data = await prisma.sharedFolder.findUnique({
      where: {
        id
      },
      include: {
        Folder: true
      }
    })
    return data;
  } catch (error) {
    console.error("Error finding shared folder:", error.message);
    throw new AppError("Internal server error", 500)
  }
}

module.exports = {
  addNewUser,
  getUserByEmail,
  getUserByID,
  createFolder,
  shareFolder,
  unshareFolder,
  deleteFolder,
  updateFolder,
  getAllFolders,
  getFolderByID,
  getFolderBySlug,
  createFile,
  getFileById,
  getSharedFolderById
};