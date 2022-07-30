const chatService = require("./chat.service");
const logger = require("../../services/logger.service");

async function getChats(req, res) {
  try {
    logger.debug("Getting chats");

    const userId = req.params.id;
    // const userId = req.query?.userId;
    const chats = await chatService.query(userId);
    res.send(chats);
  } catch (err) {
    logger.error("Failed to get chats", err);
    res.status(500).send({ err: "Failed to get chats" });
  }
}

async function addChat(req, res) {
  try {
    const chat = req.body;
    await chatService.add(chat);
    res.send({ msg: "Add successfully" });
  } catch (err) {
    logger.error("Failed to add chat", err);

    res.status(500).send({ err: "Failed to add chat" });
  }
}

async function updateChat(req, res) {
  try {
    const chat = req.body;
    const savedChat = await chatService.update(chat);
    res.send(savedChat);
  } catch (err) {
    logger.error("Failed to update chat", err);

    res.status(500).send({ err: "Failed to update chat" });
  }
}

module.exports = {
  getChats,
  addChat,
  updateChat,
};
