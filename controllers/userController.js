const UniUser = require("../models/uniUser");
const Bcrypt = require("bcryptjs");
const saltRounds = 10;
const tokenLife = process.env.TOKEN_LIFE || "365d";
const secret = process.env.SECRET || "ahihi<3";
const jwt = require("jsonwebtoken");
const { Ack } = require("../models/ack");
const { isValidObjectId } = require("mongoose");

exports.register = async (req, res) => {
  let user = req.body;
  let ack = new Ack(null, false, "Lỗi không xác định, vui lòng thử lại");
  UniUser.findOne({ email: user.email }, (err, userFromDB) => {
    if (err) {
      ack.error = "Lỗi không xác định, vui lòng thử lại";
      ack.isSuccess = false;
      res.json(ack);
    } else {
      if (userFromDB == null) {
        //email chua ton tai => cho phep dang ki
        Bcrypt.hash(user.password, saltRounds, (err, hash) => {
          newUniUser = new UniUser();
          Object.assign(newUniUser, user);
          newUniUser.password = hash;
          newUniUser.save((err, finalUniUser) => {
            let payload = {
              email: finalUniUser.email,
              id: finalUniUser._id,
            };
            jwt.sign(
              payload,
              secret,
              {
                algorithm: "HS256",
                expiresIn: tokenLife,
              },
              (err, encodedData) => {
                if (encodedData) {
                  ack.data = {
                    token: encodedData,
                    userInfo: payload,
                  };
                  ack.isSuccess = true;
                  res.json(ack);
                } else {
                  ack.isSuccess = false;
                  ack.error = "loi";
                  res.json(ack);
                }
              }
            );
          });
        });
      } else {
        ack.isSuccess = false;
        ack.error = " Email đã tồn tại, vui lòng kiểm tra lại";
        res.json(ack);
      }
    }
  });
};

exports.login = async (req, res) => {
  console.log("test");
  let ack = new Ack({}, false, "Lỗi không xác định, vui lòng thử lại");
  let loginInfo = req.body;

  if (req.isVerified) {
    ack.isSuccess = true;
    ack.data = {
      token: req.token,
      userInfo: req.decoded,
    };
    res.json(ack);
  } else {
    UniUser.findOne({ email: loginInfo.email }, (err, user) => {
      if (user) {
        Bcrypt.compare(loginInfo.password, user.password, (err, result) => {
          if (result == true) {
            let payload = {
              username: user.username,
              role: user.role,
              email: user.email,
              phoneNumber: user.phoneNumber,
              id: user._id,
            };
            jwt.sign(
              payload,
              secret,
              {
                algorithm: "HS256",
                expiresIn: tokenLife,
              },
              (err, encodedData) => {
                if (encodedData) {
                  ack.data = {
                    token: encodedData,
                    userInfo: payload,
                  };
                  ack.isSuccess = true;
                  res.json(ack);
                } else {
                  ack.isSuccess = false;
                  ack.error = "loi";
                  res.json(ack);
                }
              }
            );
          } else {
            ack.isSuccess = false;
            // ack.error = "Tài khoản không tồn tại!"
            res.json(ack);
          }
        });
      } else {
        ack.isSuccess = false;
        ack.error = "Tài khoản không tồn tại!";
        res.json(ack);
      }
    });
  }
};

exports.getUserFav = (req, res) => {

  var ack = new Ack({}, false, "");
  let uid = req.query.uid;
  if (isValidObjectId(uid)) {
    UniUser.findOne({ _id: uid }, (e, r) => {
      if (e) {
        ack.error = e;
        ack.isSuccess = false;
        res.json(ack);
      } 
      else {
        if (r != null) {
          let userInfo = {
            _id: r._id,
            favoriteUniversity: r.favoriteUniversity,
          };
          ack.data = userInfo;
          ack.isSuccess = true;
          res.json(ack);
        } else {
          ack.error("UniUser is not exist!");
          res.json(ack);
        }
      }
    });
  } else {
    ack.error("UniUser is not exist!");
    res.json(ack);
  }
};
