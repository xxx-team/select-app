var express = require('express');
var router=express.Router()

var expressSession = require('express-session');
var mongoose=require('mongoose');
var reader = mongoose.model('readers');
module.exports={
	create:function(req,res,next){
		// if exist add to session
		// else create and add to sesstion
	}
}
