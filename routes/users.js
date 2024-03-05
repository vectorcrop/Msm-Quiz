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

router.get("/home", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  adminHelper.getAlldays().then((days) => {
    res.render("users/home", { admin: false, days, user });
  });
});


router.get("/qd-view/:hello",verifySignedIn, async function (req, res, next) {
  let user = req.session.user;
  let type=user.type;
  let id= user._id;
  let jday = req.params.hello;
  let dayStatus= await adminHelper.getdaybyhello(jday);
  let iscompleted =await userHelper.checkIsCompleted(id,jday);
  // console.log("JUNNN**********",jday,type,id)
  if(iscompleted){
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
  if(dayStatus.status=="disabled"){
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

  }else{
    if(user.type =="senior"){
      await userHelper.getSeniorByDay(jday).then(async (juniors) => {
        console.log("SEEEEN**********",juniors)
        res.render("users/qd-view", { admin: false, user, juniors,type,id });
      })
    
    }else{
      await userHelper.getJuniorsByDay(jday).then(async (juniors) => {
        console.log("JUNNN**********",juniors)
        res.render("users/qd-view", { admin: false, user, juniors,type,id });
      })
    }
  }
  
});


router.post('/qd-view/:qid/:did',async function(req, res) {
  await userHelper.setAnswer(req.params.qid,req.session.user.type,req.session.user._id,req.body,req.params.did).then((resp)=>{
    var newUrl = `/rs-view/${resp.totalScore}/${resp.score}`;
    res.json({ redirectUrl: newUrl ,totalScore:resp.totalScore,score:resp.score });
  })
  
});

router.get("/rs-view/:ts/:s", verifySignedIn, function (req, res, next) {
  let user = req.session.user;
  let tScore=req.params.ts;
  let score=req.params.s;
    res.render("users/rs-view", { admin: false,user,tScore,score });
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

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  //let cartCount = await userHelper.getCartCount(userId);
  //userHelper.searchProduct(req.body).then((response) => {
    res.render("users/search-result", { admin: false, user, response });
  //});
});

module.exports = router;
