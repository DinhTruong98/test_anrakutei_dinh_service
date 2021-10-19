const UniUser = require("../models/uniUser");
const Univ = require("../models/university");
const { Ack, PagingAck } = require("../models/ack");
const { isValidObjectId } = require("mongoose");

const PAGE_SIZE = 12;
exports.getUniversity = (req, res) => {
  let pageIndex = req.query.page;
  var ack = new PagingAck({}, false, "", pageIndex, 0);
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
