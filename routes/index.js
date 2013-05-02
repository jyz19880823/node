
/*
 * GET home page.
 */

module.exports=function(app){
	app.get("/",function(req,res){
		res.render('index', { title: '主页' });
	res.cookie('name',{items:[1,2,3]})
	})
}
