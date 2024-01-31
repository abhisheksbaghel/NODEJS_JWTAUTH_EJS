const jwt = require("jsonwebtoken")
const jwtSecret = 'e6b75f9533cf88e1a5b3a40f584f394903132e6121bd535a3bb5dfbf9ada70040b770f';
exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt
  console.log("Token : : => ",token);
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log("Error : : => ",err);
        return res.status(401).json({ message: "Not authorized" })
      } else {
        console.log("Decoded Token : : => ",decodedToken);
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }