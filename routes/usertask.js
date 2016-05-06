var express = require('express');
var router=express.Router();

var expressSession = require('express-session');
var mongoose=require('mongoose');

function requireUser(req, res, next){
  if (!req.session.user) {
    res.redirect('/not_allowed');
  } else {
    next();
  }
}
function requireRootUser(req, res, next){
  if (!req.session.user) {
    res.redirect('/not_allowed');
  } else {
	    if(!req.session.user.root)
	    res.redirect('/not_allowed');
    next();
  }
}
router.get('/home',requireUser,function(req,res){
	res.render('usertask/home',{user:req.session.user});
});

module.exports =router;