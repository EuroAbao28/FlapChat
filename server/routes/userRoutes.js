const router = require("express").Router();
const {
  checkUser,
  register,
  login,
  setAvatar,
  getAllUsers,
  getUserToChat,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/checkUser", checkUser);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/getAllUsers/:id", getAllUsers);
router.get("/getUserToChat/:id", getUserToChat);

module.exports = router;
