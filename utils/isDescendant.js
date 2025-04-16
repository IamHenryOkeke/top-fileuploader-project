const prisma = require("../prisma");

async function isDescendant(parentId, childId) {
  if (parentId === childId) return true;

  const children = await prisma.folder.findMany({
    where: { parentId: parentId },
  });

  for (const child of children) {
    if (child.id === childId) return true;
    const nested = await isDescendant(child.id, childId);
    if (nested) return true;
  }

  return false;
}

module.exports = {isDescendant}