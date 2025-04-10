const prisma = require("../prisma");


async function addNewUser(values) {
  const { name, email, password } = values;
  try {
    const data = await prisma.user.create({
      data: values
    })
    console.log("New user added:", data);
    return data;
  } catch (error) {
    console.error("Error inserting new user:", error.message);
    throw new Error("Database error: Unable to add user");
  }
}


async function getUserByEmail(email) {
  try {
    const data = await prisma.user.findUnique({
      where: { email }
    })

    return data;
  } catch (error) {
    console.error("Error inserting new user:", error.message);
    throw new Error("Database error: Unable to add user");
  }
}

module.exports = {
  addNewUser,
  getUserByEmail
};