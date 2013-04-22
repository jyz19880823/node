module.exports=function(app,routes){
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/user',user.detail)
}
