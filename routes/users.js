var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var bcrypt = require('bcryptjs');
var expressAsyncHandler = require('express-async-handler');
const {objectIsEmpty, generateToken} = require('../commonServices/util.svc');
const {DUPLICATE_USER} = require('../constants/userConstant');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', expressAsyncHandler(async(req, res, next) => {
  const existingUser = await User.find({$or: [{'username': req.body.username}, {'email': req.body.email}]});
  if(objectIsEmpty(existingUser)) {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: bcrypt.hashSync(req.body.password, 8)
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      token: generateToken(createdUser)
    });
    return;
  }

  res.status(401).send({
    message: DUPLICATE_USER
  });
}));

router.post('/signin', expressAsyncHandler(async(req, res, next) => {
  const user = await User.findOne({ username: req.body.username});
  if(user) {
    if(bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user)
      });
    }
  }
  res.status(401).send({
    "message": ""
  })
}))



module.exports = router;
