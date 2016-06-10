var articleFunction= require("./articlesfunction");
var express = require('express');
var expressSession = require('express-session');
var mongoose=require('mongoose');
var article=mongoose.model('article');
var category=mongoose.model('category');
var image=mongoose.model('image');
var router=express.Router();
var fs=require('fs');
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
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
router.get('/docbao',function(req,res){
  res.render('articles/article');
});
router.get('/yourarticles',function(req,res){
  res.render('articles/yourarticles');
})
router.get('/manage_article',function(req,res){
  res.render('articles/manage_article',{user:req.session.user});
});
router.get('/upload',function(req,res){
  res.render('uploadimage');
});
var cpUpload = upload.fields([{ name: 'thumbnail', maxCount: 1 }])
router.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  console.log('body');
    console.log(req.body.name);
    var imageinstance = req.files['thumbnail'][0];
    image.create({name:image.originalname,
            path:imageinstance.path,
            encoding:imageinstance.encoding,
            mimetype:imageinstance.mimetype},function(err,images){
                if(err)
                    console.log('upload fail');
                else{
                    console.log('upload successfully!');
                }
            });
    res.render('uploadimage',{image:imageinstance.path});
})
router.post('/upload_image',function(req,res){
    var tmp_path = req.body.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + req.body.thumbnail.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            // res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
});
//delete image
//  fs.stat('./server/upload/my.csv', function (err, stats) {
//    console.log(stats);//here we got all information of file in stats variable
//    if (err) {
//        return console.error(err);
//    }
//      fs.unlink('./server/upload/my.csv',function(err){
//         if(err) return console.log(err);
//         console.log('file deleted successfully');
//    });  
// });
router.get('/article/:id',articleFunction.get_article);
router.get('/create_article',requireUser,function(req,res){
	category.find({},function(err,docs){
		if(err)
			console.log(err);
		else{
			res.render('articles/create',{category:docs});
		}
	})
});
router.get('/get_article_writer/:writeid',requireUser,articleFunction.get_articles_of_writer);
router.get('/get_article:id',articleFunction.get_article);
router.get('/get_article_comment',articleFunction.get_article_comments);
router.get('/get_new_article',articleFunction.get_new_article);
router.get('/get_new_article_of_category:category',articleFunction.get_new_article_category);
router.get('/get_most_like_article',articleFunction.get_most_like_article);
router.get('/get_most_like_article_of_category:category',articleFunction.get_most_like_article_category);
router.get('/get_article_of_author/:author',articleFunction.get_article_of_author);
router.post('/create_article',requireUser,cpUpload,articleFunction.createarticle);
router.post('/delete_article/:id',requireUser,articleFunction.delete_article)
router.post('/published/:id',requireRootUser,articleFunction.publish_article);

router.post('/post_comment/:id',articleFunction.add_comment);
router.post('/delete_comment/:id',requireRootUser,articleFunction.delete_comment);
router.post('/edit_comment/:id',requireRootUser,articleFunction.delete_comment);
router.post('/like_article/:id',articleFunction.likeartical);
router.post('/unlike_article/:id',articleFunction.unlikeartical);
router.post('/delete_article/:id',requireRootUser,function(req,res){
	article.findOne({_id:req.params.id},function(err,article){
		if(err)
			console.log('can not find this article');
		else{
			if(req.session.user.root|article.author == req.session.user.id){
				articleFunction.delete_article(req,res);
			}
			else{
				console.log('you do not have permission! ');
			}
		}!K
	})
});
router.get('/article_like_number',articleFunction.get_article_like);
router.post('/create_category',requireRootUser,articleFunction.creatcategory);
router.post('/delete_category',requireRootUser,articleFunction.deletecategory);
module.exports =router;
