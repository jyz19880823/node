var crypto=require("crypto"),
User=require('../model/user.js')
module.exports=function(app,routes){
	app.get('/',function(req,res){
			res.render("index",{title:"this is a test"})
		})
	app.get('/login',function(req,res){
			res.render("login",{name:"latpaw"})
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
			/*if(req.body['password-repeat'] != req.body['password']){*/
			/*req.flash('error','两次输入的口令不一致'); */
			/*return res.redirect('/reg');*/
			/*}*/
			/*var md5 = crypto.createHash('md5');*/
			/*var password = md5.update(req.body.password).digest('base64');*/
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
}
