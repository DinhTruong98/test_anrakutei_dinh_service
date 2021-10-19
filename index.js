var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


var indexRouter = require("./routes/index");

var app = express();
var server = require("http").createServer(app);
var port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});
dotenv.config();

const db = mongoose.connection;

//enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// connect db
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => console.log("DB Connected!"));
db.on("error", (err) => {
  console.log("DB connection error:", err.message);
});

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.writeHead(302, {
    //Location: "/",
    //add other headers here...
  });
  res.end();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;