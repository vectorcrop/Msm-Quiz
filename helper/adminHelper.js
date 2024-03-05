var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;

module.exports = {

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

  ///////GET ALL day/////////////////////                                            
  getAlldays: () => {
    return new Promise(async (resolve, reject) => {
      let days = await db
        .get()
        .collection(collections.DAY_COLLECTION)
        .find()
        .toArray();
      resolve(days);
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
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  updateDayStatus:(day,status)=>{
    if (status=="display"){
      status="enabled"
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
  //sen
  getAllseniors: () => {
    return new Promise(async (resolve, reject) => {
      let juniors = await db
        .get()
        .collection(collections.SENIOR_COLLECTION)
        .find()
        .toArray();
      resolve(juniors);
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
  getseniorDetails: (juniorId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.SENIOR_COLLECTION)
        .findOne({
          _id: objectId(juniorId)
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
              questions:[
                { 
                  key:1,
                  question: juniorDetails.question1,
                  a: juniorDetails.a1,
                  b: juniorDetails.b1,
                  c: juniorDetails.c1,
                  d: juniorDetails.d1,
                  canswer:juniorDetails.canswer1
                },
                { 
                  key:2,
                  question: juniorDetails.question2,
                  a: juniorDetails.a2,
                  b: juniorDetails.b2,
                  c: juniorDetails.c2,
                  d: juniorDetails.d2,
                  canswer:juniorDetails.canswer2
                  
                },
                { 
                  key:3,
                  question: juniorDetails.question3,
                  a: juniorDetails.a3,
                  b: juniorDetails.b3,
                  c: juniorDetails.c3,
                  d: juniorDetails.d3,
                  canswer:juniorDetails.canswer3
                },
                { 
                  key:4,
                  question: juniorDetails.question4,
                  a: juniorDetails.a4,
                  b: juniorDetails.b4,
                  c: juniorDetails.c4,
                  d: juniorDetails.d4,
                  canswer:juniorDetails.canswer4
                },
                { 
                  key:5,
                  question: juniorDetails.question5,
                  a: juniorDetails.a5,
                  b: juniorDetails.b5,
                  c: juniorDetails.c5,
                  d: juniorDetails.d5,
                  canswer:juniorDetails.canswer5
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
updatesenior: (juniorId, juniorDetails) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collections.SENIOR_COLLECTION)
      .updateOne(
        {
          _id: objectId(juniorId)
        },
        {
          $set: {
            day: juniorDetails.day,
            questions:[
              { 
                key:1,
                question: juniorDetails.question1,
                a: juniorDetails.a1,
                b: juniorDetails.b1,
                c: juniorDetails.c1,
                d: juniorDetails.d1,
                canswer:juniorDetails.canswer1
              },
              { 
                key:2,
                question: juniorDetails.question2,
                a: juniorDetails.a2,
                b: juniorDetails.b2,
                c: juniorDetails.c2,
                d: juniorDetails.d2,
                canswer:juniorDetails.canswer2
                
              },
              { 
                key:3,
                question: juniorDetails.question3,
                a: juniorDetails.a3,
                b: juniorDetails.b3,
                c: juniorDetails.c3,
                d: juniorDetails.d3,
                canswer:juniorDetails.canswer3
              },
              { 
                key:4,
                question: juniorDetails.question4,
                a: juniorDetails.a4,
                b: juniorDetails.b4,
                c: juniorDetails.c4,
                d: juniorDetails.d4,
                canswer:juniorDetails.canswer4
              },
              { 
                key:5,
                question: juniorDetails.question5,
                a: juniorDetails.a5,
                b: juniorDetails.b5,
                c: juniorDetails.c5,
                d: juniorDetails.d5,
                canswer:juniorDetails.canswer5
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

  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .find()
        .toArray();
      resolve(users);
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
