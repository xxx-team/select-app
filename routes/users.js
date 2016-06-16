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
function requireRootUser(req, res, next){
  if (!req.session.user) {
    res.redirect('/not_allowed');
  } else {
        if(!req.session.user.root)
        res.redirect('/not_allowed');
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
    var penname=req.body.penname;
    if(username=='' | password=='' | penname=='' | email=='' | lastname =='' | firstname=='')
    {   
        console.log('empty');
        var err=' All fields are required!';
        res.render('usermanage/signup',{error:err});
    }
    if (password !== password_confirmation) {
        var err = 'The passwords do not match';
        res.render('usermanage/signup',{error:err});
    } else {
        var query      = {username:username};
        // make sure this username does not exist already
        Users.findOne(query, function(err, user){
          if (user) {
            err = 'The username you entered already exists';
            res.render('usermanage/signup',{error:err});
          } else {
            // create the new user
            Users.create({  firstname: firstname,
                            lastname:lastname,
                            email:email,
                            password:password,
                            username:username,
                            penname:penname,
                            root:false,
                            active:true},
                            function(err,user){
                                if (err) {
                                    res.render('signup', {error: err});
                                } else {
                                        // This way subsequent requests will know the user is logged in.
                                        req.session.user = user;
                                        res.redirect('/user/home');  //
                                        }
                            });
            }
        })
  }
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
      if(user.active){
        req.session.user = user;
        res.redirect('/user/home');}
      else
        res.render('usermanage/block')
    } else {
      res.render('login', {message: "Incorrect username or password."});
    }
  });
});

router.get('/logout', function(req, res){
  delete req.session.user;
  res.redirect('/users/login');
});

//manage user
router.get('/', requireRootUser,function(req, res){
    // var session=req.session;
    // if(session.user) 
    //     console.log('not log in');
    // else
    //     console.log('login');
  Users.find({},function(err, users){
    if(err){
      res.render('error',{error:err});
    }
    res.render('usermanage/userlist',{userlist:users,user:req.session.user});
    // res.send({userlist:users});  
  })
});

router.get('/active',requireRootUser,function(req,res){
    Users.find({active:true},function(err,users){
        if(err)
            res.render('error',{error:err});
        res.send({activelist:users});
    });
});

router.get('/profile/:id',requireRootUser,function(req,res){
    var requestuser=req.session.user;
    Users.findOne({_id:req.params.id},function(err,user){
        if(err){
            res.render('error',{error:err});
        }
        if((!requestuser.root)&&(requestuser._id!==user._id))
            res.redirect('/not_allowed');
        res.render('usermanage/useredit',{user:user,usermanage:true});

    });
});

router.get('/profile',requireUser,function(req,res){
    res.render('usermanage/useredit',{user:req.session.user});

});

router.post('/delete/:id',requireRootUser,function(req,res){
    Users.findByIdAndRemove(req.params.id,function(err,users){
        if(err)
            res.render('error',{error:err});
        res.redirect('/users');
    });
});

router.post('/update/:id',requireRootUser,function(req,res){

    Users.findOneAndUpdate({ _id: req.params.id },
                          { firstname: req.body.firstname,
                            lastname:req.body.lastname,
                            penname:req.body.penname,
                            email:req.body.email},
                            function(err,user){
                            if(err)
                                res.render('error',{error:'cannot update that user information ,something went wrong'});
                            res.redirect('/users/profile/'+req.params.id);
    });
});  

router.post('/update',requireUser,function(req,res){
    Users.findOneAndUpdate({_id:req.session.user._id},
                            {firstname:req.body.firstname,
                            lastname:req.body.lastname,
                            penname:req.body.penname,
                            email:req.body.email},
                            function(err,user){
                            if(err)
                                res.render('error',{error:'fail'});
                            Users.findOne({_id:req.session.user._id},function(err,user){
                                if(!err)
                                    req.session.user=user;
                                else
                                    res.render('error',{error:err});
                            });
                            res.redirect("/users/profile");
    });
});  

router.post('/block/:id',requireRootUser,function(req,res){
    var user=Users.findOne({_id:req.params.id},function(err,user){
        if(err)
            console.log('can not block or unblock');
        else{
            console.log('blocking');
            user.active=!user.active;
            user.save(function(err){
                if(err){
                    res.render('error',{error:'fail to block'});
                }
                else
                    console.log('blocked');
                res.redirect('/users/profile/'+req.params.id);
            })
        }        
    });
});

router.post('/root/:id',requireRootUser,function(req,res){
    var user=Users.findOne({_id:req.params.id},function(err,user){
        if(err)
            console.log('error');
        else{
            user.root=!user.root;
            user.save(function(err){
                if(err){
                    res.render('error',{error:'fail'});
                }
                res.redirect('/users/profile/'+req.params.id);
            })
        }        
    });
});

router.post('/changepassword',requireUser,function(req,res){
    var oldpassword=req.body.oldpassword;
    var newpassword=req.body.newpassword;
    var renewpassword=req.body.renewpassword;
    var user =req.session.user;
    if(user.password!==oldpassword )
        res.render('usermanage/useredit',{alert:'password wrong',user:user});
    if(newpassword!==renewpassword)
        res.render('usermanage/useredit',{alert:'retyped password not match',user:user});
    Users.findOneAndUpdate({_id:user._id},{password:newpassword},function(err,user){
        if(err)
            res.render('error',{error:err});

        res.redirect('/users/profile');
    });
});

router.get('/not_allowed', function(req, res){
  res.render('not_allowed');
});

// The /secret url includes the requireUser middleware.
router.get('/secret', requireUser, function(req, res){
  res.send('secret');
});

module.exports = router;
