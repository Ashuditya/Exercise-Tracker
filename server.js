const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongoose = require('mongoose');
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




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
