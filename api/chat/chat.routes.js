const express = require("express");
const {
  requireAuth,
  requireAdmin,
} = require("../../middlewares/requireAuth.middleware");
const { getChats, updateChat, addChat } = require("./chat.controller");
const router = express.Router();

router.get("/:id", requireAuth, getChats);
router.put("/:id", requireAuth, updateChat);
router.post("/", requireAuth, addChat);

module.exports = router;
