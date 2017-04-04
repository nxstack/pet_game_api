const express = require('express');
const fs = require('fs');

const app = express();

var dogImages = [];
var catImages = [];
require('./middleware')(app);

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.use(express.static('./public'));

const dogPath = __dirname + '/public/dog';
const catPath = __dirname + '/public/cat';

dogImages = fs.readdirSync(dogPath);
dogImages = dogImages.filter(function(item) { return (item.indexOf('.jpg') >= 0 || item.indexOf('.jpeg') >= 0); });


catImages  = fs.readdirSync(catPath);
catImages = catImages.filter(function(item) { return (item.indexOf('.jpg') >= 0 || item.indexOf('.jpeg') >= 0); });

app.get('/:petname', function(req, res, next) {
  const petName = req.params.petname;
  var petImageName = null;
  var found = false;

  var api_key = req.query.api_key;
  if (api_key != "123456789") {
    res.status(401).send('Authorization Failed')
    return;
  }

  if(petName === 'dog') {
    const randImgNumber = Date.now() % dogImages.length;
    petImageName = dogImages[randImgNumber];
    found = true;
  }
  else if(petName === 'cat') {
    const randImgNumber = Date.now() % catImages.length;
    petImageName = catImages[randImgNumber];
    found = true;
  }
  if (found) {
    res.json({"imageUrl" :  `http://localhost:63000/${petName}/${petImageName}`});
  }
  else {
    res.status(404).send('Not found');
  }
})

module.exports = app;
