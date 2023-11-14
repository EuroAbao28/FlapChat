const router = require("express").Router();
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

router.post("/getMessages", getMessages);
router.post("/sendMessage", sendMessage);

module.exports = router;
