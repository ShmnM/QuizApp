const express = require("express");
const router = express.Router();
const { getCollection } = require("../models/db");

router.get("/api/leaderboard", async (req, res) => {
    const leaderboard = getCollection("leaderboard");
    const top = await leaderboard.find().sort({ score: -1, date: 1 }).limit(10).toArray();
    res.json(top);
})

module.exports = router;
