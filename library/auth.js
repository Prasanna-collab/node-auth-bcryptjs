const bcrypt = require("bcryptjs");

const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("Salt", salt);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

// based on what bcrypt is working?
// based on salt only it hash the password. salt is set set of keywords,  alphabets whcih will be
// shuffled and generated based on the route we given.(1-10)
const hashCompare = async (password, hashValue) => {
  try {
    return await bcrypt.compare(password, hashValue);
  } catch (error) {
    return error;
  }
};

//middleware to check admin,user or unknown entry.
const role = (req, res, next) => {
  switch (req.body.role) {
    case 1:
      res.send("Admin");
      next();
      break;
    case 2:
      res.send("User");
      next();
      break;
    default:
      res.send("Access denied");
      break;
  }
};
module.exports = { hashing, hashCompare, role };
