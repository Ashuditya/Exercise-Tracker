const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
// const {response} = require('express');
mongoose.connect(process.env.MONGO_URI);

const exerciseSchema = mongoose.Schema({
  username: {type: String, required: true},
  description: String,
  duration: {type: Number, required: true},
  date: Date
});

let Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
});
let User = mongoose.Schema("User", userSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
