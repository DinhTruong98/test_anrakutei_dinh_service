const UniUser = require("../models/uniUser");
const Univ = require("../models/university");
const { Ack, PagingAck } = require("../models/ack");
const { isValidObjectId } = require("mongoose");

const PAGE_SIZE = 12;
exports.getUniversity = (req, res) => {
  let pageIndex = req.query.page;
  let ack = new PagingAck({}, false, "", pageIndex, pageIndex);

  Univ.find()
    //   .select("name")
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * pageIndex)
    //   .sort({
    //     name: "asc",
    //   })
    .exec(function (err, _unis) {
      Univ.count().exec(function (err, count) {
        ack.data = _unis;
        ack.isSuccess = true;
        ack.pageIndex = pageIndex;
        ack.totalPages = Math.round(count / PAGE_SIZE);
        res.json(ack);
      });
    });
};
exports.searchUniversityByName = (req, res) => {
  let pageIndex = req.query.page - 1;
  let searchString = req.query.string;
  let ack = new PagingAck({}, false, "", pageIndex, 0);
  console.log(searchString);
  Univ.find({ name: { $regex: searchString, $options: "i" } })
    //   .select("name")
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * pageIndex )
    //   .sort({
    //     name: "asc",
    //   })
    .exec(function (err, _unis) {
      if (err) throw err;
      Univ.countDocuments({ name: { $regex: searchString, $options: "i" } }).exec(
        function (err, count) {
          
          ack.data = _unis;
          ack.isSuccess = true;
          ack.pageIndex = pageIndex;
          ack.totalPages = Math.round(count / PAGE_SIZE);
          res.json(ack);
        }
      );
    });
};
