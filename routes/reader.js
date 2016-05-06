var express = require('express');
var router=express.Router()

var expressSession = require('express-session');
var mongoose=require('mongoose');
var reader = mongoose.model('readers');

