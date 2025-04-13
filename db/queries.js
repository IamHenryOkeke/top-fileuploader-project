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
  }
}

async function getFolderByID(folderId) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        children: true,
        files: true,
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
  
    // Build breadcrumb path
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
  }
}

module.exports = {
  addNewUser,
  getUserByEmail,
  getUserByID,
  createFolder,
  deleteFolder,
  updateFolder,
  getAllFolders,
  getFolderByID,
  getFolderBySlug,
  createFile,
  getFileById
};