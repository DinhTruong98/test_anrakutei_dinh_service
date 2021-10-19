var express = require("express");
var router = express.Router();
var {
  login,
  getUserFav,
  increaseExp,
  register,
  getUserInfoById,
} = require("../controllers/userController.js");
var { getUniversity } = require("../controllers/universityController.js");
/* GET users listing. */
const jwt = require("jsonwebtoken");

const tokenLife = process.env.TOKEN_LIFE || "365d";
const secret = process.env.SECRET || "ahihi<3";

function isAuth(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, secret, (_error, decoded) => {
    if (decoded == null) {
      return res.json({ err: _error });
    } else {
      req.decoded = decoded;
      return next();
    }
  });
}
function isLoggedIn(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // chua co token => vao thang ham de login
  if (!token) return next();

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, secret, (_error, decoded) => {
    if (decoded == null) {
      req.isVerified = false;
      return next();
    } else {
      req.token = token;
      req.decoded = decoded;
      req.isVerified = true;
      return next();
    }
  });
}
router.post("/register", register);
router.post("/login", isLoggedIn, login);
router.get("/logout", isAuth, login);
router.get("/getUserFav", isAuth, getUserFav);
router.get("/getUniversity", getUniversity);

module.exports = router;
