var express = require("express");
var adminHelper = require("../helper/adminHelper");
var fs = require("fs");
const userHelper = require("../helper/userHelper");
var router = express.Router();
// const { server } = require("../app");
// const io = require('socket.io')(server); 

const verifySignedIn = (req, res, next) => {
  if (req.session.signedInAdmin) {
    next();
  } else {
    res.redirect("/admin/signin");
  }
};

router.get('/hide', (req, res) => {
  // Emit 'hide' event to all connected clients
  req.io.emit('hide');
  res.send('Button clicked. Hiding content.');
});

/* GET admins listing. */
router.get("/", verifySignedIn, function (req, res, next) {
  let administator = req.session.admin;
  adminHelper.getAllforgots().then((forgots) => {
    res.render("admin/home", { admin: true, layout: "admin", administator, forgots });
  })
});

router.get("/marks", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllUsers().then((users) => {
    res.render("admin/marks", { admin: true, layout: "admin", administator, users });
  });
});



///////ALL forgot/////////////////////                                         
router.get("/all-forgots", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllforgots().then((forgots) => {
    res.render("admin/all-forgots", { admin: true, layout: "admin", forgots, administator });
  });
});

///////ADD forgot/////////////////////                                         
router.get("/add-forgot", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-forgot", { admin: true, layout: "admin", administator });
});

///////ADD forgot/////////////////////                                         
router.post("/add-forgot", function (req, res) {
  adminHelper.addforgot(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/forgot-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/all-forgots");
      } else {
        console.log(err);
      }
    });
  });
});

///////EDIT forgot/////////////////////                                         
router.get("/edit-forgot/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let forgotId = req.params.id;
  let forgot = await adminHelper.getforgotDetails(forgotId);
  console.log(forgot);
  res.render("admin/edit-forgot", { admin: true, layout: "admin", forgot, administator });
});

///////EDIT forgot/////////////////////                                         
router.post("/edit-forgot/:id", verifySignedIn, function (req, res) {
  let forgotId = req.params.id;
  adminHelper.updateforgot(forgotId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/forgot-images/" + forgotId + ".png");
      }
    }
    res.redirect("/admin/all-forgots");
  });
});

///////DELETE forgot/////////////////////                                         
router.get("/delete-forgot/:id", verifySignedIn, function (req, res) {
  let forgotId = req.params.id;
  adminHelper.deleteforgot(forgotId).then((response) => {
    res.redirect("/admin/all-forgots");
  });
});

///////DELETE ALL forgot/////////////////////                                         
router.get("/delete-all-forgots", verifySignedIn, function (req, res) {
  adminHelper.deleteAllforgots().then(() => {
    res.redirect("/admin/all-forgots");
  });
});



///////ALL day/////////////////////                                         
router.get("/all-days", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAlldays().then((days) => {
    res.render("admin/all-days", { admin: true, layout: "admin", days, administator });
  });
});

///////ADD day/////////////////////                                         
router.get("/add-day", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-day", { admin: true, layout: "admin", administator });
});

///////ADD day/////////////////////                                         
router.post("/add-day", function (req, res) {
  adminHelper.addday(req.body, (id) => {
    res.redirect("/admin/all-days");
  });
});

///////EDIT day/////////////////////                                         
router.get("/edit-day/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let dayId = req.params.id;
  let day = await adminHelper.getdayDetails(dayId);
  console.log(day);
  res.render("admin/edit-day", { admin: true, layout: "admin", day, administator });
});

///////EDIT day/////////////////////                                         
router.post("/edit-day/:id", verifySignedIn, async function (req, res) {
  let dayId = req.params.id;
  let day = req.body.day;
  let status = req.body.status;
  console.log(status, "edit---day")
  if (status == "disabled") {
    req.io.emit('hide');
  }
  await adminHelper.updateday(dayId, req.body).then(() => {
    adminHelper.updateDayStatus(day, status).then(() => {
      res.redirect("/admin/all-days");
    })
  });

});

///////DELETE day/////////////////////                                         
router.get("/delete-day/:id", verifySignedIn, function (req, res) {
  let dayId = req.params.id;
  adminHelper.deleteday(dayId).then((response) => {
    res.redirect("/admin/all-days");
  });
});

///////DELETE ALL day/////////////////////                                         
router.get("/delete-all-days", verifySignedIn, function (req, res) {
  adminHelper.deleteAlldays().then(() => {
    res.redirect("/admin/all-days");
  });
});

///////ALL junior/////////////////////                                         
router.get("/all-juniors", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAlljuniors().then((juniors) => {
    res.render("admin/junior/all-juniors", { admin: true, layout: "admin", juniors, administator });
  });
});

///////ADD junior/////////////////////                                         
router.get("/add-junior", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let dayId = req.params.id;
  let days = await adminHelper.getAlldays(dayId);
  res.render("admin/junior/add-junior", { admin: true, layout: "admin", administator, days });
});

///////ADD junior/////////////////////                                         
router.post("/add-junior", async function (req, res) {
  const qObj = {};
  const data = req.body;
  const questions = [];
  const d_day = await adminHelper.getdaybyday(data.day).then(res => res.hello);

  for (let i = 1; i <= 5; i++) {
    const questionObj = {
      key: i,
      question: data[`question${i}`],
      a: data[`a${i}`],
      b: data[`b${i}`],
      c: data[`c${i}`],
      d: data[`d${i}`],
      canswer: data[`canswer${i}`]
    };
    questions.push(questionObj);
    qObj.date = data.date;
    qObj.hello = data.hello;
    qObj.day = data.day;
    qObj.d_day = d_day;
    qObj.status = data.status;
    qObj.questions = questions;
  }

  adminHelper.addjunior(qObj, (id) => {
    // Removed image uploading section
    res.redirect("/admin/all-juniors");
  });
});


///////EDIT junior/////////////////////                                         
router.get("/edit-junior/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let juniorId = req.params.id;
  let junior = await adminHelper.getjuniorDetails(juniorId);
  let dayId = req.params.id;
  let days = await adminHelper.getAlldays(dayId);
  console.log(junior);
  res.render("admin/junior/edit-junior", { admin: true, layout: "admin", junior, administator, days });
});

///////EDIT junior/////////////////////                                         
router.post("/edit-junior/:id", verifySignedIn, function (req, res) {
  let juniorId = req.params.id;
  adminHelper.updatejunior(juniorId, req.body).then(() => {
    // Removed image handling section
    res.redirect("/admin/all-juniors");
  });
});


///////DELETE junior/////////////////////                                         
router.get("/delete-junior/:id", verifySignedIn, function (req, res) {
  let juniorId = req.params.id;
  adminHelper.deletejunior(juniorId).then((response) => {
    res.redirect("/admin/all-juniors");
  });
});

///////DELETE ALL junior/////////////////////                                         
router.get("/delete-all-juniors", verifySignedIn, function (req, res) {
  adminHelper.deleteAlljuniors().then(() => {
    res.redirect("/admin/all-juniors");
  });
});

/////************************************ */
///////ALL seniors/////////////////////                                         
router.get("/all-seniors", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllseniors().then((seniors) => {
    res.render("admin/senior/all-seniors", { admin: true, layout: "admin", seniors, administator });
  });
});

///////ADD senior/////////////////////                                         
router.get("/add-senior", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let dayId = req.params.id;
  let days = await adminHelper.getAlldays(dayId);
  res.render("admin/senior/add-senior", { admin: true, layout: "admin", administator, days });
});

///////ADD senior/////////////////////                                         
router.post("/add-senior", async function (req, res) {
  const qObj = {};
  const data = req.body;
  const questions = [];
  const d_day = await adminHelper.getdaybyday(data.day).then(res => res.hello);

  for (let i = 1; i <= 5; i++) {
    const questionObj = {
      key: i,
      question: data[`question${i}`],
      a: data[`a${i}`],
      b: data[`b${i}`],
      c: data[`c${i}`],
      d: data[`d${i}`],
      canswer: data[`canswer${i}`]
    };
    questions.push(questionObj);
    qObj.date = data.date;
    qObj.hello = data.hello;
    qObj.day = data.day;
    qObj.d_day = d_day;
    qObj.status = data.status;
    qObj.questions = questions;
  }

  adminHelper.addsenior(qObj, (id) => {
    // Removed image uploading section
    res.redirect("/admin/all-seniors");
  });
});


///////EDIT senior/////////////////////                                         
router.get("/edit-senior/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let seniorId = req.params.id;
  let senior = await adminHelper.getseniorDetails(seniorId);
  let dayId = req.params.id;
  let days = await adminHelper.getAlldays(dayId);
  console.log(senior);
  res.render("admin/senior/edit-senior", { admin: true, layout: "admin", senior, administator, days });
});

///////EDIT sen/////////////////////                                         
router.post("/edit-senior/:id", verifySignedIn, function (req, res) {
  let seniorId = req.params.id;
  adminHelper.updatesenior(seniorId, req.body).then(() => {
    // Removed image handling section
    res.redirect("/admin/all-seniors");
  });
});

///////DELETE senior/////////////////////                                         
router.get("/delete-senior/:id", verifySignedIn, function (req, res) {
  let seniorId = req.params.id;
  adminHelper.deletesenior(seniorId).then((response) => {
    res.redirect("/admin/all-seniors");
  });
});

///////DELETE ALL senior/////////////////////                                         
router.get("/delete-all-seniors", verifySignedIn, function (req, res) {
  adminHelper.deleteAlljuniors().then(() => {
    res.redirect("/admin/all-seniors");
  });
});


////******************************************  */
router.get("/all-products", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllProducts().then((products) => {
    res.render("admin/all-products", { admin: true, layout: "admin", products, administator });
  });
});

router.get("/signup", function (req, res) {
  if (req.session.signedInAdmin) {
    res.redirect("/admin");
  } else {
    res.render("admin/signup", {
      admin: true, layout: "empty2",
      signUpErr: req.session.signUpErr,
    });
  }
});

router.post("/signup", function (req, res) {
  adminHelper.doSignup(req.body).then((response) => {
    console.log(response);
    if (response.status == false) {
      req.session.signUpErr = "Invalid Admin Code";
      res.redirect("/admin/signup");
    } else {
      req.session.signedInAdmin = true;
      req.session.admin = response;
      res.redirect("/admin");
    }
  });
});

router.get("/signin", function (req, res) {
  if (req.session.signedInAdmin) {
    res.redirect("/admin");
  } else {
    res.render("admin/signin", {
      admin: true, layout: "empty2",
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  adminHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedInAdmin = true;
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/admin/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedInAdmin = false;
  req.session.admin = null;
  res.redirect("/admin");
});

router.get("/add-product", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  res.render("admin/add-product", { admin: true, layout: "admin", administator });
});

router.post("/add-product", function (req, res) {
  adminHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/product-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/admin/add-product");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-product/:id", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let productId = req.params.id;
  let product = await adminHelper.getProductDetails(productId);
  console.log(product);
  res.render("admin/edit-product", { admin: true, layout: "admin", product, administator });
});

router.post("/edit-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  adminHelper.updateProduct(productId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/product-images/" + productId + ".png");
      }
    }
    res.redirect("/admin/all-products");
  });
});

router.get("/delete-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  adminHelper.deleteProduct(productId).then((response) => {
    fs.unlinkSync("./public/images/product-images/" + productId + ".png");
    res.redirect("/admin/all-products");
  });
});

router.get("/delete-all-products", verifySignedIn, function (req, res) {
  adminHelper.deleteAllProducts().then(() => {
    res.redirect("/admin/all-products");
  });
});

router.get("/all-users", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.getAllUsers().then((users) => {
    res.render("admin/all-users", { admin: true, layout: "admin", administator, users });
  });
});

router.get("/remove-user/:id", verifySignedIn, function (req, res) {
  let userId = req.params.id;
  adminHelper.removeUser(userId).then(() => {
    res.redirect("/admin/all-users");
  });
});

router.get("/remove-all-users", verifySignedIn, function (req, res) {
  adminHelper.removeAllUsers().then(() => {
    res.redirect("/admin/all-users");
  });
});

router.get("/all-orders", verifySignedIn, async function (req, res) {
  let administator = req.session.admin;
  let orders = await adminHelper.getAllOrders();
  res.render("admin/all-orders", {
    admin: true, layout: "admin",
    administator,
    orders,
  });
});

router.get(
  "/view-ordered-products/:id",
  verifySignedIn,
  async function (req, res) {
    let administator = req.session.admin;
    let orderId = req.params.id;
    let products = await userHelper.getOrderProducts(orderId);
    res.render("admin/order-products", {
      admin: true, layout: "admin",
      administator,
      products,
    });
  }
);

router.get("/change-status/", verifySignedIn, function (req, res) {
  let status = req.query.status;
  let orderId = req.query.orderId;
  adminHelper.changeStatus(status, orderId).then(() => {
    res.redirect("/admin/all-orders");
  });
});

router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  adminHelper.cancelOrder(orderId).then(() => {
    res.redirect("/admin/all-orders");
  });
});

router.get("/cancel-all-orders", verifySignedIn, function (req, res) {
  adminHelper.cancelAllOrders().then(() => {
    res.redirect("/admin/all-orders");
  });
});

router.post("/search", verifySignedIn, function (req, res) {
  let administator = req.session.admin;
  adminHelper.searchProduct(req.body).then((response) => {
    res.render("admin/search-result", { admin: true, layout: "admin", administator, response });
  });
});


module.exports = router;
