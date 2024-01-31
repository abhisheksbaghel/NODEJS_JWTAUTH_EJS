const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwtSecret = 'e6b75f9533cf88e1a5b3a40f584f394903132e6121bd535a3bb5dfbf9ada70040b770f';
exports.register = async (req, res, next) => {
    const { username,email,password } = req.body
    if (password.length < 6) {
      return res.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
          username,
          email,
          password: hash,
        })
        .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, role: user.role },
              jwtSecret,
              {
                expiresIn: maxAge, // 3hrs in sec
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000, // 3hrs in ms
            });
            res.status(201).json({
              message: "User successfully created",
              user: user._id,
            });
          })
          .catch((error) =>
            res.status(400).json({
              message: "User creation failed!!",
              error: error.message,
            })
          );
      });
  }


  exports.login = async (req, res, next) => {
    const { username,password } = req.body
    try {
      const user = await User.findOne({ username })
      if (!user) {
        res.status(401).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        bcrypt.compare(password, user.password).then(function (result) {
            if(result)
            {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                    { id: user._id, username, role: user.role },
                    jwtSecret,
                    {
                    expiresIn: maxAge, // 3hrs in sec
                    });
                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                });
                res.status(201).json({
                    message: "User successfully Logged in",
                    userid: user._id,
                    role: user.role
                });
            }
            else
            {
                res.status(400).json({ message: "Login not succesful" })
            }
          })
        }
      } catch (error) {
        res.status(400).json({
          message: "An error occurred",
          error: error.message,
        })
      }
    if (!username || !password) {
        return res.status(400).json({
          message: "Username or Password not present",
        })
      }
  }

  exports.getUsers = async (req, res, next) => {
    await User.find({})
      .then(users => {
        const userFunction = users.map(user => {
          const container = {}
          container.username = user.username
          container.role = user.role
          return container
        })
        res.status(200).json({ user: userFunction })
      })
      .catch(err =>
        res.status(401).json({ message: "Not successful", error: err.message })
      )
  }

  // exports.adminAuth = (req, res, next) => {
  //   const token = req.cookies.jwt
  //   if (token) {
  //     jwt.verify(token, jwtSecret, (err, decodedToken) => {
  //       if (err) {
  //         return res.status(401).json({ message: "Not authorized" })
  //       } else {
  //         if (decodedToken.role !== "admin") {
  //           return res.status(401).json({ message: "Not authorized" })
  //         } else {
  //           next()
  //         }
  //       }
  //     })
  //   } else {
  //     return res
  //       .status(401)
  //       .json({ message: "Not authorized, token not available" })
  //   }
  // }


  // exports.userAuth = (req, res, next) => {
  //   const token = req.cookies.jwt
  //   if (token) {
  //     jwt.verify(token, jwtSecret, (err, decodedToken) => {
  //       if (err) {
  //         return res.status(401).json({ message: "Not authorized" })
  //       } else {
  //         if (decodedToken.role !== "Basic") {
  //           return res.status(401).json({ message: "Not authorized" })
  //         } else {
  //           next()
  //         }
  //       }
  //     })
  //   } else {
  //     return res
  //       .status(401)
  //       .json({ message: "Not authorized, token not available" })
  //   }
  // }



