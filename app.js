var createError = require("http-errors");
var express = require("express");
var path = require("path");
const http = require("http");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var fileUpload = require("express-fileupload");
var db = require("./config/connection");
var session = require("express-session");
var app = express();
const connectSocket = require("./socket/socket.io");

// Socket Config
var server = http.createServer(app);

// Socket Connection
const io = connectSocket(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/header-partials/",
    helpers: {
      incremented: function (index) {
        index++;
        return index;
      },
      eq:function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
      },
      loopUntilStatus:function (items, targetStatus, options) {
        for (let i = 0; i < items.length; i++) {
          const currentItem = items[i]; 
          // Check if the current item has the target status
          if (currentItem.status === targetStatus) {
              // If the target status is found, break out of the loop
              break;
          }
          const result = options.fn(currentItem);
          // Return the result if it exists
          if (result) {
              return result;
          }
      }
      },
      getIndexForDisplay:function(items) {
        for (let i = 0; i < items.length; i++) {
            const currentItem = items[i];
            if (currentItem.status === "display") {
                // Return the index of the current item
                return i;
            }
        }
    },
    slice: function(array, start, end) {
      if (!Array.isArray(array)) {
          return [];
      }
  
      return array.slice(start, end);
  },
    loopFromIndex: function(array, startIndex, options) {
        let result = '';
        startIndex=startIndex+1;
    
        if (!Array.isArray(array) || startIndex < 0 || startIndex >= array.length) {
            return result;
        }
    
        for (let i = startIndex; i < array.length; i++) {
            result += options.fn(array[i]);
        }
    
        return result;
    }
   },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(session({ secret: "Key", cookie: { maxAge: 600000 } }))
db.connect((err) => {
  if (err) console.log("Error" + err);
  else console.log("Database Connected Successfully");
});
app.use("/", usersRouter);
app.use("/admin", adminRouter);
app.use("/admin/junior", adminRouter);

// socket add in req.io middleware
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };
