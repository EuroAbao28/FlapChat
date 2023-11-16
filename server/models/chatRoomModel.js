const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema(
  {
    members: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
