var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var article=mongoose.model('article');
/* GET home page. */
router.get('/', function(req, res, next) {
  var q=article.find({published: true}).sort({date_added:-1}).limit(50);
  q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render('index', { title: 'Báo mới',articles:articles});	
		});	
});
router.get('/hot',function(req,res){
	var q=article.find({published:true}).sort({view:-1}).limit(50);
	q.exec(function(err,articles){
		if(err)
			console.log(err);
		else
			res.render('index',{articles:articles})
	})
});
router.get('/reads/:category',function(req,res){
	var q=article.find({published: true,category:req.params.category}).sort({date_added:-1}).limit(50);
  	q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render('index', { title: 'Báo mới',articles:articles});	
		});	
});
router.get('/not_allowed',function(req,res,next){
    res.render('not_alowed',{title:'Invalid access!'})
});
router.get('/writer',function(req,res,next){
	if(req.session.user)
		res.redirect('/user/home')
	res.render('usertask/writer_home');
});
module.exports = router;