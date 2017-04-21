const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var app = express();
var port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/attendance');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs')
//app.use(bodyParser.json());
app.use(express.static('./public'))
//app.use('/public', express.static('public'))

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String},
  username: String
});

userSchema.pre('save', function (next) {
  var user = this;
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash){
      if (err) return next(err);
      user.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(undefined, isMatch);
  })
}

var User = mongoose.model('myuser', userSchema)

app.get('/', function(req, res){
  res.render('home')
})

app.delete('/delete/:id', function(req,res) {
  var id = req.params.id;
  User.findOneAndRemove({_id:id}, function(err){
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  })
})

app.get('/admin', function(req, res){
  User.find({}, function(err, foundData) {
    if(err) {
      console.log(err);
      res.status(500).send();
    } else {
      if(foundData.length = 0) {
        var responseObject = undefined;
        res.status(404).send(responseObject);
      } else {
        var responseObject = foundData;
        res.send(responseObject);
      }

    }
  })
  res.render('admin')
})

app.post('/admin', function(req, res){
  res.render('admin')
})

// app.post('/home', function(req, res){
//   res.render('home')
// })

app.get('/signup', function(req, res){
  res.render('signup')
})

app.post('/login', urlencodedParser, function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  User.findOne({username: username}, function(err, user) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    if(!user) {
      return res.status(200).send();
    }
    user.comparePassword(password, function (err, isMatch){
      if (isMatch && isMatch == true) {
        return res.status(200).send();
      } else {
        return res.status(401).send();
      }
    })

  })
})

app.post('/signup', urlencodedParser, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  console.log(email);
  var newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.username = username;
  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  })
})

app.listen(port, function(){
  console.log('listening to port '+port);
})
