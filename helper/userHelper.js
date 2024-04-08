var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;
// const { server } = require("../app");
// const io = require('socket.io')(server); 


module.exports = {

  ///////ADD feedback/////////////////////                                         
  addfeedback: (feedback, callback) => {
    console.log(feedback);
    db.get()
      .collection(collections.FEEDBACK_COLLECTION)
      .insertOne(feedback)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL feedback/////////////////////                                            
  getAllfeedbacks: () => {
    return new Promise(async (resolve, reject) => {
      let feedbacks = await db
        .get()
        .collection(collections.FEEDBACK_COLLECTION)
        .find()
        .toArray();
      resolve(feedbacks);
    });
  },

  ///////ADD feedback DETAILS/////////////////////                                            
  getfeedbackDetails: (feedbackId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FEEDBACK_COLLECTION)
        .findOne({
          _id: objectId(feedbackId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE feedback/////////////////////                                            
  deletefeedback: (feedbackId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FEEDBACK_COLLECTION)
        .removeOne({
          _id: objectId(feedbackId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE feedback/////////////////////                                            
  updatefeedback: (feedbackId, feedbackDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FEEDBACK_COLLECTION)
        .updateOne(
          {
            _id: objectId(feedbackId)
          },
          {
            $set: {
              Name: feedbackDetails.Name,
              Category: feedbackDetails.Category,
              Price: feedbackDetails.Price,
              Description: feedbackDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL feedback/////////////////////                                            
  deleteAllfeedbacks: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.FEEDBACK_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  ///////ADD forgot/////////////////////                                         
  addforgot: (forgot, callback) => {
    console.log(forgot);
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


  getJuniorsByDay: (jday) => {
    return new Promise(async (resolve, reject) => {
      let juniors = await db
        .get()
        .collection(collections.JUNIOR_COLLECTION)
        .find({ d_day: jday })
        .toArray();
      resolve(juniors);
    });
  },
  getSeniorByDay: (jday) => {
    return new Promise(async (resolve, reject) => {
      let senior = await db
        .get()
        .collection(collections.SENIOR_COLLECTION)
        .find({ d_day: jday })
        .toArray();
      resolve(senior);
    });
  },
  setAnswer: (qid, type, uid, ans, d_id) => {
    return new Promise(async (resolve, reject) => {
      var score = 0;
      if (type == "junior") {
        var correctAnswers = await db.get().collection(collections.JUNIOR_COLLECTION).aggregate([
          { $match: { _id: objectId(qid) } },
          {
            $project: {
              _id: 0, // Exclude _id field if not needed
              canswer: "$questions.canswer" // Include only canswer field from each questions array
            }
          }
        ]).toArray()


        // Ensure ans.answers is always initialized as an array
        if (Array.isArray(ans.answers)) {
          // Iterate over ans.answers only if it's an array
          ans.answers.forEach(function (answer) {
            // Find the index in correctAnswers[0].canswer based on qKey
            console.log("answer", answer)
            const index = answer.qKey - 1; // Adjusting qKey to zero-based index
            // Check if the index is within the range of correctAnswers[0].canswer
            if (index >= 0 && index < correctAnswers[0].canswer.length) {
              // Compare the answer with the corresponding index in correctAnswers[0].canswer
              if (answer.slAns === correctAnswers[0].canswer[index]) {
                console.log("correct answer", answer)
                score++;
              }
            }
          });
        } else {
          console.error('ans.answers is not an array.');
        }

      } else {
        var correctAnswers = await db.get().collection(collections.SENIOR_COLLECTION).aggregate([
          { $match: { _id: objectId(qid) } },
          {
            $project: {
              _id: 0, // Exclude _id field if not needed
              canswer: "$questions.canswer" // Include only canswer field from each questions array
            }
          }
        ]).toArray()



        // Ensure ans.answers is always initialized as an array
        if (Array.isArray(ans.answers)) {
          // Iterate over ans.answers only if it's an array
          ans.answers.forEach(function (answer) {
            // Find the index in correctAnswers[0].canswer based on qKey
            console.log("answer", answer)
            const index = answer.qKey - 1; // Adjusting qKey to zero-based index
            // Check if the index is within the range of correctAnswers[0].canswer
            if (index >= 0 && index < correctAnswers[0].canswer.length) {
              // Compare the answer with the corresponding index in correctAnswers[0].canswer
              if (answer.slAns === correctAnswers[0].canswer[index]) {
                console.log("correct answer", answer)
                score++;
              }
            }
          });
        } else {
          console.error('ans.answers is not an array.');
        }
      }
      await db.get().collection(collections.USERS_COLLECTION).findOneAndUpdate(
        { _id: objectId(uid) },
        {
          $push: { answers: ans.answers, score: score, completed: d_id }, // Push each submitted answer to the answers array
          $inc: { totalScore: score }
          // Increment the score by the calculated score
        },
        {
          returnNewDocument: true,
          returnDocument: "after"
        }
      )
        .then(updatedUser => {

          // Send the response with updated user data and aggregate score
          resolve({ totalScore: updatedUser.value.totalScore, score: score });
        })
        .catch(error => {
          console.error('Error saving answers and score:', error);
          // Handle error response
          resolve({ error: 'An error occurred while saving answers and score.' });
        });

    })

  },
  checkIsCompleted: (uid, d_id) => {
    return new Promise(async (resolve, reject) => {
      const user = await db.get().collection(collections.USERS_COLLECTION).findOne({ _id: objectId(uid) });
      if (user && user.completed) {
        // Check if the completed array includes the specified value
        resolve(user.completed.includes(d_id))
      } else {
        // If completed array is undefined or user is not found, return false
        resolve(false)
      }
    })

  },

  // doSignup: (userData) => {
  //   return new Promise(async (resolve, reject) => {
  //     userData.Password = await bcrypt.hash(userData.Password, 10);
  //     db.get()
  //       .collection(collections.USERS_COLLECTION)
  //       .insertOne(userData)
  //       .then((data) => {
  //         resolve(data.ops[0]);
  //       });
  //   });
  // },
  doSignup: async (userData) => {
    try {
      // Check if the username already exists
      userData.Username = userData.Username.toLowerCase();
      const existingUser = await db.get().collection(collections.USERS_COLLECTION).findOne({ Username: userData.Username });
      if (existingUser) {
        console.log('Username already exists');
        return ({ status: false });
      } else {

        userData.Password = await bcrypt.hash(userData.Password, 10);
        userData.answers = [],
          userData.totalScore = 0,
          userData.score = []

        // Insert user data
        const data = await db.get().collection(collections.USERS_COLLECTION).insertOne(userData);
        data.ops[0].status = true;
        console.log("nooooooooo***********", data.ops[0])
        return data.ops[0];
      }

      // Hash the password

    } catch (error) {
      throw error;
    }
  },

  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ Username: userData.Username });
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
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


};
