const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongoose = require('mongoose');
const { LongWithoutOverridesClass } = require('bson');
const e = require('express');
// const {response} = require('express');
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const exerciseSchema = mongoose.Schema({
  userId: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = mongoose.Schema({
  username: {type: String},
});
const User = mongoose.model("User", userSchema);

function getUsernameById(id){
  console.log("inside heree bitch");
  User.findById(id, (err,data)=>{
    console.log("more");
    if(err || !data){
      return undefined;
    }else{
      return data.username;
    }
  });
}
const getExerciseFromUserWithId = (id) => Exercise.findById(id, (err,data)=>{
  if(err || !data){
    return {};
  }else{
    // const rawLog = data;
    const log = data.map(l => ({
      description: l.description,
      duration: l.duration,
      date: l.date.toDateString()
    }));
    return log;
  }
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req,res)=>{ 
  console.log("req.body", req.body);
  var username = req.body.username;
  console.log(username);
  const newUser = new User({
    username: req.body.username
  });
  newUser.save((err,data)=>{
    if(err || !data)
      res.send("Error in saving the user");
    else
      res.json(data);
  });

});

app.post("/api/users/:_id/exercises", (req,res)=>{
  const id = req.params._id;
  const {description, duration, date} = req.body;
  User.findById(id, (err,userData)=>{
    console.log("heyyyy");
    if(err || !userData){
      res.send("user not found");
    }else{
      const newExercise = new Exercise({
        userId: id,
        description,
        duration,
        date: new Date(date)
      });
      newExercise.save((err, data)=>{
        if(err||!data){
          res.send("There was some problem in saving this exercise");
        }else{
          const {description, duration, date, _id} = data;
          res.json({
            username: userData.username,
            description,
            duration,
            date: date.toDateString(),
            _id: userData.id
          });
        }
        
      });
    }
  })
});

app.get("/api/users/:_id/logs", (req,res)=>{
  const userId = req.params._id;
  const {from, to, limit} = req.query;
  var uName = undefined;
  var log = [];
  User.findById(userId, (err, userData)=>{
    if(err || !userData){
      res.json("user not found");
    }else{
      uName = userData.username;
      console.log(uName);
      Exercise.find({userId: userId}, (err, data)=>{
        if (err || !data){
          console.log(err,data);
          res.json("exercise not found");
        }else{
          log = data.map(l => ({
            description: l.description,
            duration: l.duration,
            date: l.date.toDateString()
          }));
          // return log;
          if (from){
            const fromDate = new Date(from);
            log = log.filter(exe => new Date(exe.date)>fromDate);
          }
          if (to){
            const fromDate = new Date(to);
            log = log.filter(exe => new Date(exe.date)<fromDate);
          }
          if(limit){
            log = log.slice(0, +limit);
          }
        
          res.json({
            _id: userId,
            username: uName,
            count: log.length,
            log
          });
        }
      })
    }
  })
 
  
});

app.get("/api/users", (req,res)=>{
  User.find({}, (err,data)=>{
    if(err || !data)
      res.json([]);
    else
      res.json(data);
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
