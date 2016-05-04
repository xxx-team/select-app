var express = require('express');
var router=express.Router()

var expressSession = require('express-session');
var mongoose=require('mongoose');
var Users = mongoose.model('users');

function requireUser(req, res, next){
  if (!req.session.user) {
    res.redirect('/not_allowed');
  } else {
    next();
  }
}

function checkIfLoggedIn(req, res, next){
	var mongo=req.db;
  if (req.session.username) {
    var coll = mongo.collection('users');
    coll.findOne({username: req.session.username}, function(err, user){
      if (user) {
        // set a 'user' property on req
        // so that the 'requireUser' middleware can check if the user is
        // logged in
        req.user = user;
        
        // Set a res.locals variable called 'user' so that it is available
        // to every handlebars template.
        res.locals.user = user;
      }
      
      next();
    });
  } else {
    next();
  }
}

// register account
router.get('/signup', function(req,res){
  res.render('usermanage/signup');
});


router.post('/signup', function(req, res){
  // The 3 variables below all come from the form
  // in views/signup.hbs
    var username = req.body.username;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    if (password !== password_confirmation) {
        var err = 'The passwords do not match';
        res.render('signup',{error:err});
    } else {
        var query      = {username:username};
        // make sure this username does not exist already
        Users.findOne(query, function(err, user){
          if (user) {
            err = 'The username you entered already exists';
            res.render('signup',{error:err});
          } else {
            // create the new user
            Users.create({  firstname: firstname,
                            lastname:lastname,
                            email:email,
                            password:password,
                            username:username,
                            root:false,
                            active:true},
                            function(err,user){
                                if (err) {
                                    res.render('signup', {error: err});
                                } else {
                                        // This way subsequent requests will know the user is logged in.
                                        req.session.user = user;
                                        res.redirect('/users');  //
                                        }
                            });
            }
        })
  }
});

//manage user
router.get('/', requireUser,function(req, res){
    // var session=req.session;
    // if(session.user) 
    //     console.log('not log in');
    // else
    //     console.log('login');
  Users.find({},function(err, users){
    if(err){
      res.render('error',{error:err});
    }
    res.render('usermanage/userlist',{userlist:users});
    // res.send({userlist:users});  
  })
});

router.get('/active',function(req,res){
    Users.find({active:true},function(err,users){
        if(err)
            res.render('error',{error:err});
        res.send({activelist:users});
    });
});

router.get('/profile/:id',function(req,res){
    Users.findOne({_id:req.params.id},function(err,user){
        if(err){
            res.render('error',{error:err});
        }
        res.send({user:user});
    });
});

router.post('/delete/:id',function(req,res){
    Users.findByIdAndRemove(req.params.id,function(err,users){
        if(err)
            res.render('error',{error:err});
        res.redirect('/users');// render
    });
});

router.post('/update/:id',function(req,res){

    Users.findOneAndUpdate({ _id: req.params.id },
                          { firstname: req.body.firstname,
                            lastname:req.body.lastname,
                            email:req.body.email},
                            function(err,user){
                                ///render
    });
});  

router.post('/block/:id',function(req,res){
    var user=Users.findOne({_id:req.params.id},function(err,user){
        if(err)
            console.log('can not block or unblock');
        else{
            user.active=!user.active;
            user.save(function(err){
                ////////code here
            })
        }        
    });
});

router.post('/root/:id',function(req,res){
    var user=Users.findOne({_id:req.params.id},function(err,user){
        if(err)
            console.log('error');
        else{
            user.root=true;
            user.save(function(err){
                ////////code here
            })
        }        
    });
});

router.post('/changepassword/:id',function(req,res){
    var oldpassword=req.body.oldpassword;
    var newpassword=req.body.newpassword;
    var renewpassword=req.body.renewpassword;
    var user= Users.findOne({_id:req.params.id},function(err,user){
        if(err)
            console.log('can not change password');
        else{
            if(user.password!==oldpassword )
                res.send({error:'password wrong'}); /////////////////////////// not yet  show alert wrong password
            if(newpassword!==renewpassword)
                res.send({error:'password not match'});
            user.password= newpassword;
            user.save(function(err){
                ///////// code here
            });
            }
        });
});

//login logout
router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
  // These two variables come from the form on
  // the views/login.hbs page
  var username = req.body.username;
  var password = req.body.password;
  
  Users.findOne({username:username, password:password}, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.user = user;
      res.redirect('/users');
    } else {
      res.render('login', {badCredentials: true});
    }
  });
});

router.get('/logout', function(req, res){
  delete req.session.user;
  res.redirect('/users/login');
});

router.get('/not_allowed', function(req, res){
  res.render('not_allowed');
});

// The /secret url includes the requireUser middleware.
router.get('/secret', requireUser, function(req, res){
  res.render('secret');
});

module.exports = router;
