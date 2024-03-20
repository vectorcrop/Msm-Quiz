var express = require("express");
var userHelper = require("../helper/userHelper");
var adminHelper = require("../helper/adminHelper");

var router = express.Router();

const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

/* GET home page. */
router.get("/", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if (user) {
    let userId = req.session.user._id;
    // cartCount = userHelper.getCartCount(userId);
  }

  res.render("users/index", { admin: false, user, });

});



router.get("/profile", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  res.render("users/profile", { admin: false, user });
});


router.get("/done", function (req, res, next) {
  res.render("users/done", { admin: false, layout: "empty" });
});

router.get("/forgot", function (req, res, next) {
  res.render("users/forgot", { admin: false, layout: "empty" });
});


///////ADD forgot/////////////////////                                         
router.post("/forgot", function (req, res) {
  userHelper.addforgot(req.body, (id) => {
    res.redirect("/done");
  });
});

///////EDIT forgot/////////////////////                                         
// router.get("/edit-forgot/:id", verifySignedIn, async function (req, res) {
//   let user = req.session.user;
//   let forgotId = req.params.id;
//   let forgot = await adminHelper.getforgotDetails(forgotId);
//   console.log(forgot);
//   res.render("admin/forgot/edit-forgot", { admin: true, layout: "", forgot, user });
// });

///////EDIT forgot/////////////////////                                         
// router.post("/edit-forgot/:id", verifySignedIn, function (req, res) {
//   let forgotId = req.params.id;
//   adminHelper.updateforgot(forgotId, req.body).then(() => {
//     if (req.files) {
//       let image = req.files.Image;
//       if (image) {
//         image.mv("./public/images/forgot-images/" + forgotId + ".png");
//       }
//     }
//     res.redirect("/users/all-forgots");
//   });
// });

///////DELETE forgot/////////////////////                                         
router.get("/delete-forgot/:id", verifySignedIn, function (req, res) {
  let forgotId = req.params.id;
  adminHelper.deleteforgot(forgotId).then((response) => {
    fs.unlinkSync("./public/images/forgot-images/" + forgotId + ".png");
    res.redirect("/users/all-forgots");
  });
});

///////DELETE ALL forgot/////////////////////                                         
router.get("/delete-all-forgots", verifySignedIn, function (req, res) {
  adminHelper.deleteAllforgots().then(() => {
    res.redirect("/users/all-forgots");
  });
});

router.get("/donation", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  res.render("users/donation", { admin: false, user });
});

router.get("/homme", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  adminHelper.getAlldays().then((days) => {
    res.render("users/homme", { admin: false, days, layout: "layout2", user });
  });
});

router.get("/home", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  adminHelper.getAlldays().then((days) => {
    res.render("users/home", { admin: false, days, layout: "layout2", user });
  });
});



router.get("/qd-view/:hello", verifySignedIn, async function (req, res, next) {
  let user = req.session.user;
  let type = user.type;
  let id = user._id;
  let jday = req.params.hello;
  let dayStatus = await adminHelper.getdaybyhello(jday);
  let iscompleted = await userHelper.checkIsCompleted(id, jday);
  // console.log("JUNNN**********",jday,type,id)
  if (iscompleted) {
    const htmlContent = `
    <html>
      <head>
        <style>
          * {
            transition: all 0.6s;
          }
          html {
            height: 100%;
          }
          body {
            font-family: 'Lato', sans-serif;
            color: #888;
            margin: 0;
          }
          #main {
            display: table;
            width: 100%;
            height: 100vh;
            text-align: center;
          }
          .fof {
            display: table-cell;
            vertical-align: middle;
          }
          .fof h1 {
            font-size: 50px;
            display: inline-block;
            padding-right: 12px;
            animation: type .5s alternate infinite;
          }
          @keyframes type {
            from {
              box-shadow: inset -3px 0px 0px #888;
            }
            to {
              box-shadow: inset -3px 0px 0px transparent;
            }
          }
        </style>
      </head>
      <body>
        <div id="main">
          <div class="fof">
            <h1>Your response has already been submitted</h1>
          </div>
        </div>
      </body>
    </html>
  `;

    res.send(htmlContent);
  }
  console.log(dayStatus,"dayStatus")
  if (dayStatus?.status == "disabled" || dayStatus== null) {
    //want 404 page
    const htmlContent = `
    <html>
      <head>
        <style>
          * {
            transition: all 0.6s;
          }
          html {
            height: 100%;
          }
          body {
            font-family: 'Lato', sans-serif;
            color: #888;
            margin: 0;
          }
          #main {
            display: table;
            width: 100%;
            height: 100vh;
            text-align: center;
          }
          .fof {
            display: table-cell;
            vertical-align: middle;
          }
          .fof h1 {
            font-size: 50px;
            display: inline-block;
            padding-right: 12px;
            animation: type .5s alternate infinite;
          }
          @keyframes type {
            from {
              box-shadow: inset -3px 0px 0px #888;
            }
            to {
              box-shadow: inset -3px 0px 0px transparent;
            }
          }
        </style>
      </head>
      <body>
        <div id="main">
          <div class="fof">
            <h1>Error 404</h1>
          </div>
        </div>
      </body>
    </html>
  `;

    res.send(htmlContent);

  } else {
    if (user.type == "senior") {
      await userHelper.getSeniorByDay(jday).then(async (juniors) => {
        console.log("SEEEEN**********", juniors)
        res.render("users/qd-view", { admin: false, user, juniors, type, id });
      })

    } else {
      await userHelper.getJuniorsByDay(jday).then(async (juniors) => {
        console.log("JUNNN**********", juniors)
        res.render("users/qd-view", { admin: false, user, juniors, type, id });
      })
    }
  }

});

router.get('/retry',(req,res)=>{
res.render("users/retry", { admin: false})
})

router.post('/qd-view/:qid/:did',verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let id = user._id;
  let jday = req.params.did;
  let iscompleted = await userHelper.checkIsCompleted(id, jday);

  if (iscompleted) {
    const htmlContent = `
    <html>
      <head>
        <style>
          * {
            transition: all 0.6s;
          }
          html {
            height: 100%;
          }
          body {
            font-family: 'Lato', sans-serif;
            color: #888;
            margin: 0;
          }
          #main {
            display: table;
            width: 100%;
            height: 100vh;
            text-align: center;
          }
          .fof {
            display: table-cell;
            vertical-align: middle;
          }
          .fof h1 {
            font-size: 50px;
            display: inline-block;
            padding-right: 12px;
            animation: type .5s alternate infinite;
          }
          @keyframes type {
            from {
              box-shadow: inset -3px 0px 0px #888;
            }
            to {
              box-shadow: inset -3px 0px 0px transparent;
            }
          }
        </style>
      </head>
      <body>
        <div id="main">
          <div class="fof">
            <h1>Your response has already been submitted</h1>
          </div>
        </div>
      </body>
    </html>
  `;
  var newUrl = `/retry`;
  res.json({ redirectUrl: newUrl, totalScore: 0, score: 0 });
   // res.send(htmlContent);
  }else{
  await userHelper.setAnswer(req.params.qid, req.session.user.type, req.session.user._id, req.body, req.params.did).then((resp) => {
    var newUrl = `/rs-view/${resp.totalScore}/${resp.score}`;
    res.json({ redirectUrl: newUrl, totalScore: resp.totalScore, score: resp.score });
  })
}

});

router.get("/rs-view/:ts/:s", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  let tScore = req.params.ts;
  let score = req.params.s;
  res.render("users/rs-view", { admin: false, user, tScore, score });
});

router.get("/3", function (req, res, next) {
  let user = req.session.user;
  res.render("users/rs-view3", { admin: false, user});
});

router.get("/2", function (req, res, next) {
  let user = req.session.user;
  res.render("users/rs-view2", { admin: false, user});
});


router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", {
      admin: false, layout: "empty",
      signUpErr: req.session.signUpErr
    });
    req.session.signUpErr = null;
  }
});

router.post("/signup", function (req, res) {
  userHelper.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response;
      res.redirect("/");
    } else {
      req.session.signUpErr = "Username is already taken. Please choose a different username by changing your name details.";
      res.redirect("/signup");
    }

  });
});

router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    console.log("serverrr err",req.session.signInErr)
    res.render("users/signin", {
      admin: false,
      layout: "empty",
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});

router.post("/signin", function (req, res) {
  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.signInErr = "Invalid Email/Password";
      res.redirect("/signin");
    }
  });
});

router.get("/signout", function (req, res) {
  req.session.signedIn = false;
  req.session.user = null;
  res.redirect("/");
});

// s

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  //let cartCount = await userHelper.getCartCount(userId);
  //userHelper.searchProduct(req.body).then((response) => {
  res.render("users/search-result", { admin: false, user, response });
  //});
});

module.exports = router;
