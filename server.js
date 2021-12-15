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
  username: {type: String, required: true},
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





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
