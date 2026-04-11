const express = require("express");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();
const { getCollection } = require("../models/db");

function hashPassword(password, salt, callback) {
  crypto.scrypt(password, salt, 64, callback);
}

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = getCollection("users");
  const user = await users.findOne({ username });

  if (!user) return res.redirect("/login.html?error=invalid");

  hashPassword(password, user.salt, (err, derivedKey) => {
    if (err) return res.redirect("/login.html?error=server");
    if (derivedKey.toString("hex") !== user.hash)
      return res.redirect("/login.html?error=invalid");

    req.session.user = username;
    res.redirect("/home.html");
  });
});

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword)
    return res.redirect("/register.html?error=missing");
  if (password !== confirmPassword)
    return res.redirect("/register.html?error=mismatch");
  if (password.length < 4)
    return res.redirect("/register.html?error=short");

  const users = getCollection("users");
  const exists = await users.findOne({ username });
  if (exists) return res.redirect("/register.html?error=exists");

  const salt = crypto.randomBytes(16).toString("hex");

  hashPassword(password, salt, async (err, derivedKey) => {
    if (err) return res.redirect("/register.html?error=server");

    await users.insertOne({
      username,
      salt,
      hash: derivedKey.toString("hex"),
      history: [],
    });

    req.session.user = username;
    res.redirect("/home.html");
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

module.exports = router;
