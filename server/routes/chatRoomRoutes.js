const router = require("express").Router();
const { getChatRoom } = require("../controllers/chatRoomController");

router.post("/getChatRoom", getChatRoom);

module.exports = router;
