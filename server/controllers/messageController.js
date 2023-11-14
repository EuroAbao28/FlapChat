const messageModel = require("../models/messageModel");

const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    const messages = await messageModel
      .find({
        $or: [
          {
            sender: sender,
            receiver: receiver,
          },
          {
            sender: receiver,
            receiver: sender,
          },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, sender, receiver } = req.body;

    const send = await messageModel.create({
      text,
      sender,
      receiver,
    });

    res.status(201).json(send);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { getMessages, sendMessage };
