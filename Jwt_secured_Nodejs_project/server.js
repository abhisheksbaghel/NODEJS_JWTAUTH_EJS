const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { adminAuth, userAuth } = require('./middleware/auth.js');
const {MONGO_URI} = require('./config');
const { default: mongoose } = require('mongoose');
const postRoutes = require('./routes/api/posts_controller');

// ------------------------------------------------------------------------------------------------
//for view pupose

app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("home"))
app.get("/register", (req, res) => res.render("register"))
app.get("/login", (req, res) => res.render("login"))

// ------------------------------------------------------------------------------------------------

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/posts', postRoutes);
app.use("/api/auth", require("./auth/route"));
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})



//for mongodb connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});