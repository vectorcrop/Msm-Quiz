var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;

module.exports = {


  ///////ADD key/////////////////////                                         
  addkey: (key, callback) => {
    console.log(key);
    key.Price = parseInt(key.Price);
    db.get()
      .collection(collections.KEY_COLLECTION)
      .insertOne(key)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL key/////////////////////                                            
  getAllkeys: () => {
    return new Promise(async (resolve, reject) => {
      let keys = await db
        .get()
        .collection(collections.KEY_COLLECTION)
        .find()
        .toArray();
      resolve(keys);
    });
  },

  ///////ADD key DETAILS/////////////////////                                            
  getkeyDetails: (keyId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.KEY_COLLECTION)
        .findOne({
          _id: objectId(keyId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE key/////////////////////                                            
  deletekey: (keyId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.KEY_COLLECTION)
        .removeOne({
          _id: objectId(keyId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE key/////////////////////                                            
  updatekey: (keyId, keyDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.KEY_COLLECTION)
        .updateOne(
          {
            _id: objectId(keyId)
          },
          {
            $set: {
              day: keyDetails.day,
              status: keyDetails.status,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL key/////////////////////                                            
  deleteAllkeys: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.KEY_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  ///////ADD forgot/////////////////////                                         
  addforgot: (forgot, callback) => {
    console.log(forgot);
    forgot.Price = parseInt(forgot.Price);
    db.get()
      .collection(collections.FORGOT_COLLECTION)
      .insertOne(forgot)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },


  ///////GET ALL forgot/////////////////////                                            
  getAllforgots: () => {
    return new Promise(async (resolve, reject) => {
      let forgots = await db
        .get()
        .collection(collections.FORGOT_COLLECTION)
        .find()
        .toArray();
      resolve(forgots);
    });
  },

  ///////ADD forgot DETAILS/////////////////////                                            
  getforgotDetails: (forgotId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FORGOT_COLLECTION)
        .findOne({
          _id: objectId(forgotId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE forgot/////////////////////                                            
  deleteforgot: (forgotId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FORGOT_COLLECTION)
        .removeOne({
          _id: objectId(forgotId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE forgot/////////////////////                                            
  updateforgot: (forgotId, forgotDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FORGOT_COLLECTION)
        .updateOne(
          {
            _id: objectId(forgotId)
          },
          {
            $set: {
              Name: forgotDetails.Name,
              Category: forgotDetails.Category,
              Price: forgotDetails.Price,
              Description: forgotDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL forgot/////////////////////                                            
  deleteAllforgots: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FORGOT_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },


  ///////ADD day/////////////////////                                         
  addday: (day, callback) => {
    console.log(day);
    db.get()
      .collection(collections.DAY_COLLECTION)
      .insertOne(day)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  incrementCounter: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let update = await db
          .get()
          .collection(collections.USERS_COLLECTION)
          .updateMany({ type: "senior" }, { $inc: { totalScore: 1 } })

        resolve(update);
      } catch (error) {
        console.log(error, "frommm0000000000000000000")
        reject(error);
      }
    });
  },

  ///////GET ALL day/////////////////////                                            
  getAlldays: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let days = await db
          .get()
          .collection(collections.DAY_COLLECTION)
          .find()
          .toArray();

        // Sort the days array based on the "day" property
        days.sort((a, b) => {
          // Assuming "day" is a string like "Day 1", "Day 2", etc.
          const dayA = parseInt(a.day.split(" ")[1]);
          const dayB = parseInt(b.day.split(" ")[1]);
          return dayA - dayB;
        });

        resolve(days);
      } catch (error) {
        reject(error);
      }
    });
  },


  ///////ADD day DETAILS/////////////////////                                            
  getdayDetails: (dayId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .findOne({
          _id: objectId(dayId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getdaybyday: (day) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .findOne({
          day: day
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getdaybyhello: (hello) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .findOne({
          hello: hello
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE day/////////////////////                                            
  deleteday: (dayId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .removeOne({
          _id: objectId(dayId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE day/////////////////////                                            
  updateday: (dayId, dayDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .updateOne(
          {
            _id: objectId(dayId)
          },
          {
            $set: {
              // date: dayDetails.date,
              // hello: dayDetails.hello,
              day: dayDetails.day,
              status: dayDetails.status,
              key: dayDetails.key,

            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  updateDayStatus: (day, status) => {
    if (status == "display") {
      status = "enabled"
    }
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.JUNIOR_COLLECTION)
        .updateOne(
          {
            day: day
          },
          {
            $set: {
              status: status,
            },
          }
        )
        .then((response) => {
          resolve();
        });

    })
  },


  ///////DELETE ALL day/////////////////////                                            
  deleteAlldays: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DAY_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },





  ///////ADD junior/////////////////////                                         
  addjunior: (junior, callback) => {
    console.log(junior);
    db.get()
      .collection(collections.JUNIOR_COLLECTION)
      .insertOne(junior)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL junior/////////////////////                                            
  getAlljuniors: () => {
    return new Promise(async (resolve, reject) => {
      let juniors = await db
        .get()
        .collection(collections.JUNIOR_COLLECTION)
        .find()
        .toArray();
      resolve(juniors);
    });
  },

  ///////ADD senior/////////////////////                                         
  addsenior: (senior, callback) => {
    console.log(senior);
    db.get()
      .collection(collections.SENIOR_COLLECTION)
      .insertOne(senior)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  //senior
  getAllseniors: () => {
    return new Promise(async (resolve, reject) => {
      let seniors = await db
        .get()
        .collection(collections.SENIOR_COLLECTION)
        .find()
        .toArray();
      resolve(seniors);
    });
  },

  getAllSeniorsExceptLast: () => {
    return new Promise(async (resolve, reject) => {
      let seniors = await db
        .get()
        .collection(collections.SENIOR_COLLECTION)
        .find()
        .toArray();
      
      // Remove the last element from the seniors array
      seniors.pop();
  
      resolve(seniors);
    });
  },
  getAllJuniorExceptLast: () => {
    return new Promise(async (resolve, reject) => {
      let seniors = await db
        .get()
        .collection(collections.JUNIOR_COLLECTION)
        .find()
        .toArray();
      
      // Remove the last element from the seniors array
      seniors.pop();
  
      resolve(seniors);
    });
  },
  ///////ADD junior DETAILS/////////////////////                                            
  getjuniorDetails: (juniorId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.JUNIOR_COLLECTION)
        .findOne({
          _id: objectId(juniorId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },
  //sen
  getseniorDetails: (seniorId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.SENIOR_COLLECTION)
        .findOne({
          _id: objectId(seniorId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE junior/////////////////////                                            
  deletejunior: (juniorId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.JUNIOR_COLLECTION)
        .removeOne({
          _id: objectId(juniorId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  deletesenior: (juniorId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.SENIOR_COLLECTION)
        .removeOne({
          _id: objectId(juniorId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE junior/////////////////////                                            
  updatejunior: (juniorId, juniorDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.JUNIOR_COLLECTION)
        .updateOne(
          {
            _id: objectId(juniorId)
          },
          {
            $set: {
              day: juniorDetails.day,
              questions: [
                {
                  key: 1,
                  question: juniorDetails.question1,
                  a: juniorDetails.a1,
                  b: juniorDetails.b1,
                  c: juniorDetails.c1,
                  d: juniorDetails.d1,
                  canswer: juniorDetails.canswer1
                },
                {
                  key: 2,
                  question: juniorDetails.question2,
                  a: juniorDetails.a2,
                  b: juniorDetails.b2,
                  c: juniorDetails.c2,
                  d: juniorDetails.d2,
                  canswer: juniorDetails.canswer2

                },
                {
                  key: 3,
                  question: juniorDetails.question3,
                  a: juniorDetails.a3,
                  b: juniorDetails.b3,
                  c: juniorDetails.c3,
                  d: juniorDetails.d3,
                  canswer: juniorDetails.canswer3
                },
                {
                  key: 4,
                  question: juniorDetails.question4,
                  a: juniorDetails.a4,
                  b: juniorDetails.b4,
                  c: juniorDetails.c4,
                  d: juniorDetails.d4,
                  canswer: juniorDetails.canswer4
                },
                {
                  key: 5,
                  question: juniorDetails.question5,
                  a: juniorDetails.a5,
                  b: juniorDetails.b5,
                  c: juniorDetails.c5,
                  d: juniorDetails.d5,
                  canswer: juniorDetails.canswer5
                }
              ],
              status: juniorDetails.status,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  //sen
  updatesenior: (seniorId, seniorDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.SENIOR_COLLECTION)
        .updateOne(
          {
            _id: objectId(seniorId)
          },
          {
            $set: {
              day: seniorDetails.day,
              questions: [
                {
                  key: 1,
                  question: seniorDetails.question1,
                  a: seniorDetails.a1,
                  b: seniorDetails.b1,
                  c: seniorDetails.c1,
                  d: seniorDetails.d1,
                  canswer: seniorDetails.canswer1
                },
                {
                  key: 2,
                  question: seniorDetails.question2,
                  a: seniorDetails.a2,
                  b: seniorDetails.b2,
                  c: seniorDetails.c2,
                  d: seniorDetails.d2,
                  canswer: seniorDetails.canswer2

                },
                {
                  key: 3,
                  question: seniorDetails.question3,
                  a: seniorDetails.a3,
                  b: seniorDetails.b3,
                  c: seniorDetails.c3,
                  d: seniorDetails.d3,
                  canswer: seniorDetails.canswer3
                },
                {
                  key: 4,
                  question: seniorDetails.question4,
                  a: seniorDetails.a4,
                  b: seniorDetails.b4,
                  c: seniorDetails.c4,
                  d: seniorDetails.d4,
                  canswer: seniorDetails.canswer4
                },
                {
                  key: 5,
                  question: seniorDetails.question5,
                  a: seniorDetails.a5,
                  b: seniorDetails.b5,
                  c: seniorDetails.c5,
                  d: seniorDetails.d5,
                  canswer: seniorDetails.canswer5
                }
              ],
              status: seniorDetails.status,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  ///////DELETE ALL junior/////////////////////                                            
  deleteAlljuniors: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.JUNIOR_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  //senior
  deleteAllseniors: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.SENIOR_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },







  addProduct: (product, callback) => {
    console.log(product);
    product.Price = parseInt(product.Price);
    db.get()
      .collection(collections.PRODUCTS_COLLECTION)
      .insertOne(product)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },



  doSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      if (adminData.Code == "admin123") {
        adminData.Password = await bcrypt.hash(adminData.Password, 10);
        db.get()
          .collection(collections.ADMIN_COLLECTION)
          .insertOne(adminData)
          .then((data) => {
            resolve(data.ops[0]);
          });
      } else {
        resolve({ status: false });
      }
    });
  },

  doSignin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let admin = await db
        .get()
        .collection(collections.ADMIN_COLLECTION)
        .findOne({ Email: adminData.Email });
      if (admin) {
        bcrypt.compare(adminData.Password, admin.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .removeOne({ _id: objectId(productId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              Name: productDetails.Name,
              Category: productDetails.Category,
              Price: productDetails.Price,
              Description: productDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  deleteAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },
  getUsersByDay: (day) => {
    return new Promise(async (resolve, reject) => {
      try {
        let users = await db
          .get()
          .collection(collections.USERS_COLLECTION)
          .find({ completed: day })
          .toArray();

        let matchedUsers = [];
        users.forEach((user) => {
          const index = user.completed.findIndex(completedDay => completedDay === day);
          if (index !== -1) {
            matchedUsers.push({
              _id: user._id,
              score: user.score[index],
              Fname: user.Fname,
              Lname: user.Lname,
              type: user.type,
              zone: user.zone,
              Mobile: user.Mobile,
              matchedIndex: index
            });
          }
        });


        console.log("matchhhh", matchedUsers);


        // Sort the users array based on the "totalScore" property
        //matchedUsers.sort((a, b) => b.totalScore - a.totalScore);

        resolve(matchedUsers);
      } catch (error) {
        reject(error);
      }
    });

  },

  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let users = await db
          .get()
          .collection(collections.USERS_COLLECTION)
          .find()
          .toArray();

        // Sort the users array based on the "totalScore" property
        users.sort((a, b) => b.totalScore - a.totalScore);

        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  },


  removeUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .removeOne({ _id: objectId(userId) })
        .then(() => {
          resolve();
        });
    });
  },

  removeAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .find()
        .toArray();
      resolve(orders);
    });
  },

  changeStatus: (status, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": status,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  cancelAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" }).then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        })

    });
  },
};
