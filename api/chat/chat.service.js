const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;
const logger = require("../../services/logger.service");

module.exports = {
  query,
  update,
  add,
};

async function query(userId) {
  const criteria = _buildCriteria(userId);
  try {
    const collection = await dbService.getCollection("chat");
    var chats = await collection.find(criteria).toArray();
    return chats;
  } catch (err) {
    logger.error("cannot find chats", err);

    throw err;
  }
}

async function update(chat) {
  try {
    // peek only updatable fields!
    const chatToSave = {
      _id: ObjectId(chat._id),
      users: chat.users,
      name: chat.name,
      msgs: chat.msgs,
    };
    const collection = await dbService.getCollection("chat");
    await collection.updateOne({ _id: chatToSave._id }, { $set: chatToSave });
    return chatToSave;
  } catch (err) {
    logger.error(`cannot update chat ${chat._id}`, err);
    throw err;
  }
}

async function add(chat) {
  try {
    // peek only updatable fields!
    const chatToAdd = {
      users: chat.users,
      name: chat.name,
      msgs: chat.msgs,
    };
    const collection = await dbService.getCollection("chat");
    await collection.insertOne(chatToAdd);
    return chatToAdd;
  } catch (err) {
    logger.error("cannot insert chat", err);
    throw err;
  }
}

function _buildCriteria(userId) {
  if ((userId = "all")) return {};
  return {
    users: { $elemMatch: { _id: userId } },
  };
}
