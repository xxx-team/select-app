var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Báo mới' });
});

router.get('/not_allowed',function(req,res,next){
    res.render('not_alowed',{title:'Invalid access!'})
});
router.get('/writer',function(req,res,next){
	if(req.session.user)
		res.redirect('/user/home')
	res.render('writer_home');
});
module.exports = router;