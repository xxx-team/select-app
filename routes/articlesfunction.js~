var express = require('express');
var router=express.Router();
var expressSession = require('express-session');
var mongoose=require('mongoose');
// var fileUpload = require('express-fileupload');
var article=mongoose.model('article');
var comment=mongoose.model('comment');
var reply=mongoose.model('reply');
// var ArticleContent=mongoose.model('ArticleContent');
var paragraph=mongoose.model('paragraph');
var category=mongoose.model('category');
var image=mongoose.model('image');
var Users=mongoose.model('users');
function createarticle(title,description,author,penname,categoryid,thumbleid,content,callback){           //writer
	if(title==''| categoryid=='' | thumbleid =='' ){
		message='all field are require!';
		callback(message);
	}
	else{
            // create the new user
            article.create({ 	title:title,
							description:description,
							likeNumber:0,
							author:author,
							penname:penname,
							date_added: new Date(),
							category:categoryid,
							thumbleImage:thumbleid,
							published:false,
							content:content},
                            function(err,article){
                                if (err) {
                                    callback(err);
                                } else {
		                                callback(err,article);
                                        }
                            });
        }
}
function deletearticle(articleID){			//writer  admin	
	article.findByIdAndRemove(articleID,function(err){
		if(err)
			console.log(err);
	})
}
function editartical(articleID,updatedata,callback){				//writer
	article.findOneAndUpdate(articleID,updatedata,function(err,article){
		if(err)
			callback(err);
		else
			callback(err,article);
	})
}

function createparagraph(data,callback){
	//writer
	paragraph.create(data,function(err,paragraph){
		if(err)
			callback(err);
		else
			callback(err,paragraph);
	})
}
function deleteparagraph(paragraphID){     //writer
	paragraph.findByIdAndRemove(paragraphID,function(err){
	if(err)
		console.log(err);
	})
}
function createcomment(data){      //reader
	comment.create(data,function(err,comment){
		if(err)
			callback(err);
		else
			callback(err,comment);
	})
}
function deletecomment(commentID){     //reader and admin
	paragraph.findByIdAndRemove(commentID,function(err){
	if(err)
		console.log(err);
	})
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
		var title =req.body.title;
		var aritcle_description=req.body.description;
		var article_author=req.session.user._id;
		var penname=req.session.user.penname;
		var categoryid=req.body.category;
		var content=req.body.content;
		var imageinstance = req.files['thumbnail'][0];
		console.log(imageinstance.originalname);
    	image.create({name:image.originalname,
            path:imageinstance.path,
            encoding:imageinstance.encoding,
            mimetype:imageinstance.mimetype},function(err,images){
                if(err)
                    console.log('upload fail');
                else
                {
                    console.log('upload successfully!');
                    createarticle(title,aritcle_description,article_author,penname,categoryid,images._id,content,function(err,article){
						if(err)
							console.log(err);
						else
						{	
							res.redirect('/article/get_article_writer/'+article_author);
						}       // -----------------------------render
					});
                }
            });
		console.log('start');
		console.log(title);
		console.log(article_author);
		console.log(aritcle_description);
		console.log(penname);
		console.log(content);

	},
	publish_article:function(req,res){ /////////////params
		editartical(req.params.id,{published:true},function(err,article){
			if(err)
				console.log(err);
		})		
	},
	delete_article:function(req,res){ ///////////params
		deletearticle(req.params.id);
	},
	get_article: function(req,res){
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				 /////////////////////////////
						// res.render('articles/article',{article:article,articlecontent:content,comments:[]});
				res.send({article:article,comments:[]});
			}
		});
	},
	get_articles_of_writer:function(req,res){
		article.find({author:req.params.writeid},function(err,articles){
			if(err)
				console.log(err);
			else{console.log(articles);
				res.send({articles:articles});
			}
		})
	},
	get_new_article:function(req,res){
		var q=article.find({published: true}).sort({'date_added': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.send(); ////////////////////////////////////////
		});		
	},
	get_new_article_category:function(req,res){  ////////parameter
		var q=article.find({published: true,category:req.params.category}).sort({'date_added': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render(); ////////////////////////////////////////
		});		
	},
	get_most_like_article:function(req,res){
		var q=article.find({published: true}).sort({'likeNumber': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render(); ////////////////////////////////////////
		});				
	},
	get_most_like_article_category:function(req,res){ ////////////params
		var q=article.find({published: true,category:req.params.category}).sort({'likeNumber': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render(); ////////////////////////////////////////
		});				
	},
	get_article_of_author:function(req,res){ /////////params
		var q=article.find({published: true,author:req.params.author}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render(); ////////////////////////////////////////
		});			
	},
	get_author_of_article:function(req,res){////////////////////params
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var authorid=article.authorid;
				author.findOne({_id:authorid},function(err,author){
					if(err)
						console.log(err);
					else{
						///////////////////////////////////////
					}
				});
			}
		});
	},
	get_article_comments:function(req,res){ //////////params
		comment.find({article:req.params.id},function(err,comments){
			if(err)
				console.log(err);
			else
			{
				///////////////////////////////////////////////
			}
		})
	},
	add_comment:function(req,res){ ////////////////params
		var data={reader:req.session.reader._id,
		content:req.body.content,
		article:req.params.id,
		reply:[],
		like:0,
		date_added:new Date()}
		createcomment(data,function(err,comment){
			if(err)
				console.log(err);
			else{
				////////////////////////////////////////
			}
		});
	},
	delete_comment:function(req,res){

	},
	edit_comment:function(req,res){

	},
	get_comment_reply:function(req,res){

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
	likeartical:function (req,res){///////////////params
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var like = article.likeNumber+1;
				editartical({likeNumber:like},function(err,article){});
			}
		})
	},
	unlikeartical:function (req,res){///////////////params
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var like = article.likeNumber-1;
				if (like<0)
					like=0;
				editartical({likeNumber:like},function(err,article){});
			}
		})
	},
	get_article_like: function(req,res){////////////////parameter
				article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var like = article.likeNumber; //////////////////////////////////////////////
			}
		})
	},
	like_reply:function(req,res){
		console.log("not undefined yet");
	},
	unlike_reply:function(){

	},
	creatcategory:function(req,res){
		category.create({name:req.body.name,description:req.body.description},function(err,category){
		if(err)
			console.log(err);
		else
			res.send('success!'); ////////////////////////////////////////////// render
	})
	},
	deletecategory:function(req,res){
		category.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log(err);
		})
	}	
}
