const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var app = express();
var port = process .env .PORT || 3000 ;

mongoose.connect('mongodb://register:register@ds155418.mlab.com:55418/attendance');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs')
app.use(express.static('./public'))

var todoSchema = new mongoose.Schema({
  item: String
})

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String},
  firstname: String,
  lastname: String
});

var eventSchema = new mongoose.Schema({
  option: String,
  firstname: String,
  lastname: String
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

app.get('/', function(req, res){
  //get data from mongodb and pass it to view
  Todo.find({}, function(err, data){
    if  (err) throw err
    res.render('home', {todos: data})
  })
})

app.post('/', urlencodedParser, function(req, res){
    //get data from the view and add it to mongodb
    var firstname = req.body.firstname.toLowerCase();
    var lastname = req.body.lastname.toLowerCase();
    var password = req.body.password;
    var option = req.body.single;

    var newUserEvent = new Options();
    if (firstname === 'admin' && lastname === 'admin' && password === 'admin') {
      res.json(req.body);
    }

    User.findOne({lastname: lastname, firstname: firstname}, function(err, user) {
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
          newUserEvent.firstname = firstname;
          newUserEvent.lastname = lastname;
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


app.post('/signup', urlencodedParser, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var lastname = req.body.lastname.toLowerCase();
  var firstname = req.body.firstname.toLowerCase();
  var newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.lastname = lastname;
  newUser.firstname = firstname;
  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send();
  })
})

app.get('/admin', function(req, res){
  //get data from mongodb and pass it to view
  Todo.find({}, function(err, data){
    User.find({}, function(err, foundData) {
      if(err) {
        res.status(500).send();
      } else {
        var responseObject = foundData;
        res.render('admin', {users: responseObject, todos: data})
      }
    })
  })
})

app.post('/admin', urlencodedParser, function(req, res){
  //get data from the view and add it to mongodb
  console.log(req.params.item);
  var newTodo = Todo(req.body).save(function(err, data){
    if (err) throw err
    res.send()
  })
})

app.delete('/admin/:item', function(req, res){
  //delete the requested item from mongodb
  Todo.find({item: req.params.item}).remove(function(err, data){
    if(err) throw err
    res.json(data)
  })
})

app.get('/admin/:item', function(req, res){
  var show = req.params.item;
  console.log(req.params.item);
  Options.find({option: show},function(err, dataEvent){
          if(err) {
            throw err
          }
          console.log(dataEvent);
          res.json(dataEvent);
        })
})

app.listen(port, function(){
  console.log('listening to port '+port);
})
