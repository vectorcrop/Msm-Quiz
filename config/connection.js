const mongoClient = require("mongodb").MongoClient;

const state = {
  db: null,
};

module.exports.connect = function (done) {
  const url = "mongodb+srv://clientsvectorcrop:vector.com001@kmct.uk6jd.mongodb.net/?retryWrites=true&w=majority&appName=KMCT";
  const dbname = "MsmRamadanQuiz";

  mongoClient.connect(url, { useUnifiedTopology: true }, (err, data) => {
    if (err) {
      return done(err);
    }
    state.db = data.db(dbname);

    done();
  });
};

module.exports.get = function () {
  return state.db;
};
