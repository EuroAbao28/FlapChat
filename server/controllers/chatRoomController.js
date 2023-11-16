const chatRoomModel = require("../models/chatRoomModel");

const getChatRoom = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    const chatRoom = await chatRoomModel.findOne({
      members: {
        $all: [sender, receiver],
      },
    });

    // if there is no room, create one
    if (!chatRoom) {
      try {
        const createRoom = await chatRoomModel.create({
          members: [sender, receiver],
        });

        res
          .status(201)
          .json({ roomId: createRoom._id, message: "New Room Created" });
      } catch (error) {
        console.log(error);
        res.json(error);
      }
      return;
    }

    res.status(200).json({ roomId: chatRoom._id, message: "Room found" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { getChatRoom };
