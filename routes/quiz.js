const express = require("express");
const router = express.Router();
const { getCollection } = require("../models/db");

router.post("/save-score", async (req, res) => {
  if (!req.session.user) return res.status(403).send("Unauthorized");
  const { score, total, category } = req.body;

  const users = getCollection("users");
  const leaderboard = getCollection("leaderboard");

  const entry = {
    score,
    total,
    category: category || "General",
    date: new Date()
  };

  await users.updateOne(
    { username: req.session.user },
    { $push: { history: entry } },
    { upsert: true }
  );

  await leaderboard.insertOne({
    user: req.session.user,
    score,
    total,
    category: entry.category,
    date: entry.date
  });

  res.sendStatus(200);
});

router.get("/api/profile", async (req, res) => {
  if (!req.session.user) return res.status(403).send("Unauthorized");

  const users = getCollection("users");
  const user = await users.findOne({ username: req.session.user });

  res.json(user?.history || []);
});



module.exports = router;
