var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;


module.exports = {

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
  setAnswer:(qid,type,uid,ans)=>{
    return new Promise(async (resolve, reject)=>{
      var score = 0;
      if(type=="junior"){
        var correctAnswers= await db.get().collection(collections.JUNIOR_COLLECTION).aggregate([
        { $match: { _id: objectId(qid)  } },
          {
            $project: {
              _id: 0, // Exclude _id field if not needed
              canswer: "$questions.canswer" // Include only canswer field from each questions array
            }
          }
        ]).toArray()

        ans.answers.forEach(function(answer) {
          // Find the index in correctAnswers[0].canswer based on qKey
          const index = answer.qKey - 1; // Adjusting qKey to zero-based index
          // Check if the index is within the range of correctAnswers[0].canswer
          if (index >= 0 && index < correctAnswers[0].canswer.length) {
              // Compare the answer with the corresponding index in correctAnswers[0].canswer
              if (answer.slAns === correctAnswers[0].canswer[index]) {
                  score++;
              }
          }
      });

      }else{
        var correctAnswers= await db.get().collection(collections.SENIOR_COLLECTION).aggregate([
          { $match: { _id: objectId(qid)  } },
            {
              $project: {
                _id: 0, // Exclude _id field if not needed
                canswer: "$questions.canswer" // Include only canswer field from each questions array
              }
            }
          ]).toArray()
  
          ans.answers.forEach(function(answer) {
            // Find the index in correctAnswers[0].canswer based on qKey
            const index = answer.qKey - 1; // Adjusting qKey to zero-based index
            // Check if the index is within the range of correctAnswers[0].canswer
            if (index >= 0 && index < correctAnswers[0].canswer.length) {
                // Compare the answer with the corresponding index in correctAnswers[0].canswer
                if (answer.slAns === correctAnswers[0].canswer[index]) {
                    score++;
                }
            }
        });
      }
      await db.get().collection(collections.USERS_COLLECTION).findOneAndUpdate(
        {_id:  objectId(uid)},
        {
          $push: { answers: ans.answers,score:score }, // Push each submitted answer to the answers array
          $inc: { totalScore: score } // Increment the score by the calculated score
        },
        {  returnNewDocument: true,
          returnDocument: "after" }
      )
      .then(updatedUser => {
      
        // Send the response with updated user data and aggregate score
        resolve({ totalScore: updatedUser.value.totalScore,score:score });
      })
      .catch(error => {
        console.error('Error saving answers and score:', error);
        // Handle error response
        resolve({ error: 'An error occurred while saving answers and score.' });
      });

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
             return({ status: false });
          }else{
            
            userData.Password = await bcrypt.hash(userData.Password, 10);
            userData.answers =[],
            userData.totalScore=0,
            userData.score=[]

            // Insert user data
            const data = await db.get().collection(collections.USERS_COLLECTION).insertOne(userData);
            data.ops[0].status=true;
            console.log("nooooooooo***********",data.ops[0])
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
