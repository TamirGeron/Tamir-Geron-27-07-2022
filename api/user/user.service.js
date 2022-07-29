const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  query,
  getById,
  getByEmail,
  remove,
  update,
  add,
};

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection("user");
    var users = await collection.find(criteria).toArray();
    users = users.map((user) => {
      delete user.password;
      user.createdAt = ObjectId(user._id).getTimestamp();
      return user;
    });
    return users;
  } catch (err) {
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ _id: ObjectId(userId) });
    // delete user.password
    return user;
  } catch (err) {
    throw err;
  }
}
async function getByEmail(email, password) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ email });
    return user;
  } catch (err) {
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    throw err;
  }
}

async function update(user) {
  try {
    // peek only updatable fields!
    const userToSave = {
      _id: ObjectId(user._id),
      email: user.email,
      name: user.name,
      friends: user.friends,
    };
    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    throw err;
  }
}

async function add(user) {
  try {
    // peek only updatable fields!
    const userToAdd = {
      email: user.email,
      password: user.password,
      name: user.name,
      isAdmin: false,
      friends: [],
    };
    const collection = await dbService.getCollection("user");
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" };
    criteria.$or = [
      {
        email: txtCriteria,
      },
      {
        name: txtCriteria,
      },
    ];
  }
  return criteria;
}
