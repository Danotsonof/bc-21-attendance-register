const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var app = express();
var port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/todo');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs')
//app.use(bodyParser.json());
app.use(express.static('./public'))
//app.use('/public', express.static('public'))

var todoSchema = new mongoose.Schema({
  item: String
})

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String},
  username: String
});

var eventSchema = new mongoose.Schema({
  username: String,
  option: String
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

var Todo = mongoose.model('Todo', todoSchema)

var User = mongoose.model('myuser', userSchema)

var Options = mongoose.model('event', eventSchema)

app.get('/homeCopy', function(req, res){
  //get data from mongodb and pass it to view
  Todo.find({}, function(err, data){
    if  (err) throw err
    res.render('homeCopy', {todos: data})
  })
})

app.post('/homeCopy', urlencodedParser, function(req, res){
    //get data from the view and add it to mongodb
    var username = req.body.username;
    var password = req.body.password;
    var option = req.body.single;

    var newUserEvent = new Options();

    User.findOne({username: username}, function(err, user) {
      if(err) {
        console.log(err);
        return res.status(500).send();
      }
      if(!user) {
        return res.status(401).send();
      }
      user.comparePassword(password, function (err, isMatch){
        if (isMatch && isMatch == true) {
          newUserEvent.option = option;
          newUserEvent.username = username;
          newUserEvent.save(function(err, savedUser) {
            if(err) {
              console.log(err);
              return res.status(500).send();
            }
            return res.status(200).send();
          })

          //return res.status(200).send();
        } else {
          return res.status(401).send();
        }
      })

    })
  })

app.get('/signupCopy', function(req, res){
  res.render('signupCopy')
})

app.post('/signupCopy', urlencodedParser, function(req, res){
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

app.get('/adminCopy', function(req, res){
  //get data from mongodb and pass it to view

  Todo.find({}, function(err, data){
  //   if  (err) throw err
  //   //res.render('adminCopy', {todos: data})
  // //})
    User.find({}, function(err, foundData) {

      if(err) {
        console.log(err);
        res.status(500).send();
      } else {
        // if(foundData.length = 0) {
        //   var responseObject = undefined;
        //   res.status(404).send(responseObject);
        // }
        // else {
        var responseObject = foundData;
        res.render('adminCopy', {users: responseObject, todos: data})
        // }
      }
      //res.render('adminCopy', {users: responseObject, todos: data})
    })
  //res.render('adminCopy', {users: responseObject})
  })
})
//POST is used to insert/update remote data.
app.post('/adminCopy', urlencodedParser, function(req, res){
  //get data from the view and add it to mongodb
  console.log(req.params.item);
  var newTodo = Todo(req.body).save(function(err, data){
    if (err) throw err
    res.send()
  })
})

app.delete('/adminCopy/:item', function(req, res){
  //delete the requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
    if(err) throw err
    res.json(data)
  })
})

app.get('/adminCopy/:item', function(req, res){

  //console.log(req.params.item);
  Options.find({option: req.params.item},function(err, dataEvent){
          //console.log(dataEvent);
          if(err) throw err
          //res.render('adminCopy', {events: dataEvent})
          res.json(dataEvent);
        })
})

app.listen(port, function(){
  console.log('listening to port '+port);
})
