const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const { connectDB } = require("./models/db");

const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login.html");
    }
}

app.get("/home.html", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/home.html"));
});
app.get("/profile.html", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/profile.html"));
});
app.get("/quiz.html", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/quiz.html"));
});
app.get("/results.html", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/results.html"));
});
app.get("/leaderboard.html", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public/leaderboard.html"));
});

app.use(express.static(path.join(__dirname, "public")));


app.use(require("./routes/auth"));
app.use(require("./routes/quiz"));
app.use(require("./routes/leaderboard"));

app.get("/", (req, res) => res.redirect("/login.html"));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
