var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/about', router);
};

router.get('/', function(req, res){
  res.render('about');
});