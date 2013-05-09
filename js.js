var settings = {
	db : 'caiji',
	host:'localhost'
}
var Db=require('mongodb').Db,
	Connection=require('mongodb').Connection,
	Server = require('mongodb').Server;
	db=new Db(settings.db,new Server(settings.host,Connection.DEFAULT_PORT,{}),{safe:true});


var $=require("jquery");
var http = require('http');

var html = '';
http.get('http://www.zenithcrusher.com/products/crushing/jaw-crusher.html',function(res){
		res.on('data',function(d){html+=d});
		res.on('end',function(){
				var h2 = $(html).find("h2")
				var ad = $(html).find(".s_address")
				var feature = $(html).find("#con_one_1")
				/*console.log(h2.html()+"\r\n"+ad.html()+"\r\n"+feature.html())*/
				db.open(function(err,dbc){
						if(err){console.log(err)}
						dbc.collection("crushers",function(err,col){
								col.insert({title:h2.html(),summary:ad.html(),feature:feature.html()},function(){db.close()})
							})
					})
			})
	})


