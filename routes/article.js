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
var cpUpload = upload.fields([{ name: 'thumbnail', maxCount: 1 }]);

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
};

router.get('/get_image_name/:id',function(req,res){
  image.findOne({_id:req.params.id},function(err,image){
    if(err)
      console.log(err);
    else
      res.send(image.name);
  })
});

router.get('/yourarticles',requireUser,function(req,res){
  article.find({},function(err,articles){
  res.render('articles/yourarticles',{user:req.session.user,articles:articles});
  });
});

router.get('/manage_article',requireRootUser,function(req,res){
  article.find({},function(err,articles){
    if(err){
      console.log(err);
    }
    else{
      res.render('articles/manage_article',{user:req.session.user,articles:articles});
    }
  })
});

router.get('/upload',function(req,res){
  res.render('uploadimage');
});

router.get('/create_article',requireUser,function(req,res){
    var obj = JSON.parse(fs.readFileSync('public/category.json', 'utf8'));
		res.render('articles/create',{category:obj,user:req.session.user});
});


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
		}
	})
});

router.post('/cool-profile', cpUpload, function (req, res, next) {
    var imageinstance = req.files['thumbnail'][0];
    var target_path = 'public/images/upload/'+imageinstance.originalname;
    var tmp_path = imageinstance.path;
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });
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
router.get('/search/:query',articleFunction.searcharticle);

router.get('/get_article_writer/:writeid',requireUser,articleFunction.get_articles_of_writer);

router.get('/get_article/:id',articleFunction.get_article);

router.get('/get_article_comment',articleFunction.get_article_comments);

router.get('/get_new_article',articleFunction.get_new_article);

router.get('/get_new_article_of_category:category',articleFunction.get_new_article_category);

router.get('/get_most_like_article',articleFunction.get_most_like_article);

router.get('/get_most_like_article_of_category:category',articleFunction.get_most_like_article_category);

router.get('/get_article_of_author/:author',articleFunction.get_article_of_author);

router.post('/create_article',requireUser,cpUpload,articleFunction.createarticle);

router.post('/published/:id',requireRootUser,articleFunction.publish_article);

router.post('/post_comment/:id',articleFunction.add_comment);

router.post('/delete_comment/:id',requireRootUser,articleFunction.delete_comment);

router.post('/edit_comment/:id',requireRootUser,articleFunction.delete_comment);

router.post('/like_article/:id',articleFunction.likeartical);

router.post('/unlike_article/:id',articleFunction.unlikeartical);

router.get('/article_like_number',articleFunction.get_article_like);

router.post('/create_category',requireRootUser,articleFunction.creatcategory);

router.post('/delete_category',requireRootUser,articleFunction.deletecategory);

module.exports =router;
