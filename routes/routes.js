var crypto=require("crypto"),
Post=require('../model/post.js')
User=require('../model/user.js')
var md = require("node-markdown").Markdown
module.exports=function(app,routes){
	app.get("*",function(req,res,next){
			if(req.session.user){
				login=true
			}else{login=false}
			/*if(res.status(404).send("not found"))*/
			next()
		})
	app.get('/',function(req,res){
			Post.get(null,function(err,posts){
					if(err){
						posts=[];
					}
					res.render('index',{
							title:'this is title',
							user:req.session.user || "",
							posts:posts,
							success:req.flash('success').toString()
						})
				})
		})
	app.get('/post/new',checkLogin)
	app.get('/post/new', function(req, res){
			res.render('new',{
					title:'post a post',
					user:req.session.user || "",
					success:req.flash('success').toString(),
					error:req.flash('error').toString()
				})
		});
	app.post('/post/new', function(req, res){
			var currentUser = req.session.user;
			post=new Post(currentUser.name,req.body.title,req.body.post)
			post.save(function(err){
					if(err){
						req.flash('error',err)
						return res.redirect('/')
					}
					req.flash('success','Sueccessed!')
					res.redirect('/post/'+req.body.title)
				})
		});
	app.get('/post/:id/edit',function(req,res){
			Post.findOne(req.params.id,function(err,post){
					res.render("post_edit",{
							user:req.session.user || "",
							title:post.title,
							name:post.user,
							time:post.time,
						    post:post.post
						})
				})
		})
	app.get('/post/:id',function(req,res){
			Post.findOne(req.params.id,function(err,post){
					res.render("post",{
							user:req.session.user || "",
							title:post.title,
							name:post.user,
							time:post.time,
							comments:post.comments||[],
							post:post.post
						})
				})
		})
	app.get('/login',function(req,res){
			res.render("login",{
					user:req.session.user||"",
					title:"login"
					})
		})
	app.get('/reg', function(req,res){
			res.render('reg',{
					title:'注册',
					user:req.session.user,
					success:req.flash('success').toString(),
					error:req.flash('error').toString()
				}); 
		});
	app.post('/reg', function(req,res){
			var password=req.body.password;
			var newUser = new User({
					name: req.body.username,
					password: password,
				});
			User.get(newUser.name, function(err, user){
					if(user){
						err = '用户已存在';
					}
					if(err){
						req.flash('error', err);
						return res.redirect('/reg');
					}
					newUser.save(function(err){
							if(err){
								req.flash('error',err);
								return res.redirect('/reg');
							}
							req.session.user = newUser;
							req.flash('success','注册成功');
							res.redirect('/');
						});
				});
		});
	app.get('/login', function(req, res){
			res.render('login',{
					title:'登录',
					user:req.session.user,
					success:req.flash('success').toString(),
					error:req.flash('error').toString()
				}); 
		});
	app.post('/login', function(req, res){
			/*var md5 = crypto.createHash('md5'),*/
			/*password = md5.update(req.body.password).digest('base64');*/
			var password=req.body.password;
			User.get(req.body.username, function(err, user){
					if(!user){
						req.flash('error', '用户不存在'); 
						return res.redirect('/login'); 
					}
					if(user.password != password){
						req.flash('error', '密码错误'); 
						return res.redirect('/login');
					}
					req.session.user = user;
					req.flash('success','登陆成功');
					res.redirect('/');
				});
		});
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res){
			req.session.user = null;
			req.flash('success','登出成功');
			res.redirect('/');
		});

	app.get('/post', checkLogin);
	app.post('/post', checkLogin);
	app.post('/post/:id/edit', function(req, res){
			var currentUser = req.session.user;
			var post = {
				post:req.body.post,
				title:req.body.title
			}
			Post.update(req.params.id,post)
			res.redirect('/post/'+req.params.id)
		});
	app.get('/post/:id/delete',function(req,res){
			Post.remove(req.params.id)
			res.redirect('/')
		})
	app.post('/post/:id/comment/add',function(req,res){
			var comment= {
				name:req.body.name,
				content:req.body.content
			}
			Post.add_comment(req.params.id,comment,function(commid){
					res.send(200,""+commid)
				})
		})
	app.get('/post/:id/comment/:comm_id/delete',function(req,res){
			Post.remove_comment(req.params.id,req.params.comm_id,req,res,function(req,res){
					res.send(200)
				})
			/*res.redirect('/post/'+req.params.id)*/
		})
};

function checkLogin(req, res, next){
	if(!req.session.user){
		req.flash('error','未登录'); 
		return res.redirect('/login');
	}
	next();
}


function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录'); 
		return res.redirect('/');
	}
	next();
}
