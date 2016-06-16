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
var fs=require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
function createarticle(title,description,author,penname,categoryid,thumbleid,thumbename,content,callback){           //writer
	if(title==''| categoryid=='' | thumbleid =='' ){
		message='all field are require!';
		callback(message);
	}
	else{
            // create the new user
            article.create({ 	title:title,
							description:description,
							likeNumber:0,
							view:0,
							author:author,
							penname:penname,
							date_added: new Date(),
							category:categoryid,
							thumbleImage:thumbleid,
							thumbleImageName:thumbename,
							published:false,
							content:content},
                            function(err,article){
                                if (err) {
                                    callback(err);
                                } else {
                                		console.log(article);
		                                callback(err,article);
                                        }
                            });
        }
}
function searcharticle(){
	article.find()
}
function deletearticle(articleID){
	article.findByIdAndRemove(articleID,function(err){
		if(err)
			console.log(err);
	})
}
function editartical(articleID,updatedata,callback){
	article.findOneAndUpdate({_id:articleID},updatedata,function(err,article){
		if(err)
			callback(err);
		else
			callback(err,article);
	})
}
function encreasingview(arID){
	article.findOne({_id:arID},function(err,article){
		if(err)
			console.log(err)
		else{
			console.log('find article');
			article.view++;
			article.save();
		}

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
function editcomment(){ 

}
function createreply(){ 

}
function deletereply(){

}
function editreply(){

}
function createimage(){

}
function deleteimage(){

}

function change_alias( alias )
{
    var str = alias;
    str= str.toLowerCase(); 
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str= str.replace(/đ/g,"d"); 
    str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
    str= str.replace(/-+-/g,"-");
    str= str.replace(/^\-+|\-+$/g,""); 
    str=str.replace(' ','-');
    return str;
}
function getmostviewarticle(callback){
	  var q=article.find({published:true}).sort({view:-1}).limit(5);
	  q.exec(function(err,articles){
	    if(err)
	      console.log(err);
	    else{
	      callback(err,articles);
	    }
	  });
};
function tinlienquan(category,callback){

  var q=article.find({published:true,category:category}).sort({view:-1}).limit(6);
  q.exec(function(err,articles){
    if(err)
      console.log(err);
    else
      callback(err,articles);
  });
}
module.exports={
	createarticle:function(req,res){
		var title =req.body.title;
		var aritcle_description=req.body.description;
		var article_author=req.session.user._id;
		var penname=req.session.user.penname;
		var categoryid=change_alias(req.body.cagegory);
		var content=req.body.paragraph;
		var imageinstance = req.files['thumbnail'][0];
		var target_path = 'public/images/upload/'+imageinstance.originalname;
    	var tmp_path = imageinstance.path;
    	console.log(categoryid);
    	fs.rename(tmp_path, target_path, function(err) {
        	if (err) throw err;
        	fs.unlink(tmp_path, function() {
            if (err) throw err;
        	});
    	});
    	image.create({name:imageinstance.originalname,
            path:target_path,
            encoding:imageinstance.encoding,
            mimetype:imageinstance.mimetype},function(err,images){
                if(err)
                    console.log('upload fail');
                else
                {
                    console.log('upload successfully!');
                    createarticle(title,aritcle_description,article_author,penname,categoryid,images._id,imageinstance.originalname,content,function(err,article){
						if(err)
							console.log(err);
						else
						{	
							res.redirect('/article/yourarticles');
						}
					});
                }
            });
	},
	publish_article:function(req,res){
		editartical(req.params.id,{published:true},function(err,article){
			if(err)
				console.log(err);
			else
				console.log('ok roi nhe')
				// res.send('ok');
		})		
	},
	delete_article:function(req,res){
		deletearticle(req.params.id);
	},
	get_article: function(req,res){
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				encreasingview(req.params.id);
				getmostviewarticle(function(err,mostview){
					if(err)
						console.log(err);
					else
						tinlienquan(article.category,function(err,tinlienquan){
							if(err)
								console.log(err);
							else{
								res.render('articles/read_article',{article:article,mostview:mostview,tinlienquan:tinlienquan});
							}
						});
				})

			}
		});
	},
	searcharticle: function(req,res){
		searcharticle(req.params.query,function(err,articles){
			if(err)
				console.log(err);
			else
				res.render('index', { title: 'Báo mới',articles:articles});	
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
		     	res.send();
		});		
	},
	get_new_article_category:function(req,res){
		var q=article.find({published: true,category:req.params.category}).sort({'date_added': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render();
		});		
	},
	get_most_like_article:function(req,res){
		var q=article.find({published: true}).sort({'likeNumber': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render();
		});				
	},
	get_most_like_article_category:function(req,res){
		var q=article.find({published: true,category:req.params.category}).sort({'likeNumber': -1}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render();
		});				
	},
	get_article_of_author:function(req,res){
		var q=article.find({published: true,author:req.params.author}).limit(30);
		q.exec(function(err, articles) {
		     if(err)
		     	console.log(err);
		     else
		     	res.render();
		});			
	},
	get_author_of_article:function(req,res){
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var authorid=article.authorid;
				author.findOne({_id:authorid},function(err,author){
					if(err)
						console.log(err);
					else{
					}
				});
			}
		});
	},
	get_article_comments:function(req,res){
		comment.find({article:req.params.id},function(err,comments){
			if(err)
				console.log(err);
			else
			{
			}
		})
	},
	add_comment:function(req,res){
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
			}
		});
	},
	likeartical:function (req,res){
		article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var like = article.likeNumber+1;
				editartical({likeNumber:like},function(err,article){});
			}
		})
	},
	unlikeartical:function (req,res){
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
	get_article_like: function(req,res){
				article.findOne({_id:req.params.id},function(err,article){
			if(err)
				console.log(err);
			else{
				var like = article.likeNumber;
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
			res.send('success!'); 
	})
	},
	deletecategory:function(req,res){
		category.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log(err);
		})
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
}
