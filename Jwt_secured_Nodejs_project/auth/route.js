const express = require("express")
const router = express.Router()
const {adminAuth} = require('../middleware/auth');
const { register,login,getUsers } = require("./auth")
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/fetch_all").get(adminAuth,getUsers)
module.exports = router