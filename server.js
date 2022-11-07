const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

var db, collection;
const dbName = "palindrome";
const url =
  `mongodb+srv://abdullahidev:Github12@cluster0.rasf3io.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.listen(3500, () => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      db = client.db();
      console.log("Connected to `" + dbName + "`!");
    }
  );
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  db.collection("results")
    .find()
    .toArray((err, allDocuments) => {
      if (err) return console.log(err);
      res.render("index.ejs", { palindromes : allDocuments });
    });
});

app.post("/palindromesave", (req, res) => {
  db.collection("results").insertOne(
    { userWordinput: req.body.word, userResults: req.body.dbResult },
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to database");
      res.redirect("/");
    }
  );
});
app.delete("/delete", (req, res) => {
  db.collection("results").findOneAndDelete(
    { userWordinput: req.body.deleteWord, userResults: req.body.deleteResult },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("Message deleted!");
    }
  );
});


// previous logic on palindrome applied to express! 
// reference link https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
  app.get ('/palindromecheck',(req,res)=> {
  let result = 'false'
  let word = req.query.word
  if (word){
    // check if params word is a palindrome
    // convert to lowercase
    word = word.toLowerCase();
    var reverse = word.split('').reverse().join('').toLowerCase();
    if (word == reverse){
      result = 'true';
    }
  }
  const objToJson = {
    result: result
  }
  // reference link https://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(objToJson));
})
// ====================== Refer Later ==============================
app.put("/messages", (req, res) => {
  db.collection("results").findOneAndUpdate(
    { name: req.body.name, msg: req.body.msg },
    {
      $set: {
        thumbUp: req.body.thumbUp + 1,
      },
    },
    {
      sort: { _id: -1 },
      upsert: true,
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});
