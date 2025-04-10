const bcrypt = require('bcryptjs');

async function validPassword(password, hashedPassword) {
  const res = await bcrypt.compare(password, hashedPassword);
  return res;
}

async function genPassword(password) {
  const res = await bcrypt.hash(password, 10);
  return res;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;