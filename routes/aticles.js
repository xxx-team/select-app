var express = require('express');
var router=express.Router();
var expressSession = require('express-session');
var mongoose=require('mongoose');
var fileUpload = require('express-fileupload');
var article=mongoose.model('article');
var comment=mongoose.model('comment');
var reply=mongoose.model('reply');
var ArticleContent=mongoose.model('ArticleContent');
var paragraph=mongoose.model('paragraph');
var category=mongoose.model('category');
var image=mongoose.model('image');

function createarticle(){           //writer

}
function deletearticle(){			//writer  admin	

}
function editartical(){				//writer

}
function createcontent(){			//writer
	
}
function deletecontent(){			//writer

}
function createparagraph(){

}
function deleteparagraph(){     //writer

}
function createcomment(){      //reader

}
function deletecomment(){     //reader and admin

}
function editcomment(){      // only reader

}
function createreply(){        //reader

}
function deletereply(){

}
function editreply(){

}
function createimage(){

}
function deleteimage(){

}



module.exports={
	createarticle:function(req,res){

	},
	edit_article_content:function(req,res){

	},
	publish_article:function(req,res){

	},
	delete_article:function(req,res){

	},
	get_new_article:function(req,res){

	},
	get_new_article_category:function(req,res){

	},
	get_most_like_article:function(req,res){

	},
	get_most_like_article_category:function(req,res){

	},
	get_article_author:function(req,res){

	},
	get_article_comment:function(req,res){

	},
	get_comment_reply:function(req,res){

	},
	add_comment:function(req,res){

	},
	delete_comment:function(req,res){

	},
	edit_comment:function(req,res){

	},
	add_reply:function(req,res){

	},
	delete_reply:function(req,res){

	},
	edit_reply:function(req,res){

	},
	likecomment:function(){

	},
	unlikecomment:function (){

	},
	likeartical:function (){

	},
	unlikeartical:function (){
	},
	like_reply:function(){

	},
	unlike_reply:function(){

	},
	creatcategory:function(){

	},
	deletecategory:function(){

	}	
}