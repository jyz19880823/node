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
var options={
	host:'www.zenithcrusher.com',
	port:'80'
}
http.get(options,function(res){
		res.on('data',function(d){html+=d});
		res.on('end',function(){
				var result=[]
				var as = $(html).find("a").each(function($this){
						var href = $(this).attr("href")
						makeurl(options.host,href,function(url){
								_push(result,url)	
							})
					})
				console.log(result)
				/*for(i in as){*/
				/*console.log(as[i],i)*/
				/*}*/
				/*var h2 = $(html).find("h2")*/
				/*var ad = $(html).find(".s_address")*/
				/*var feature = $(html).find("#con_one_1")*/
				/*console.log(h2.html()+"\r\n"+ad.html()+"\r\n"+feature.html())*/
				/*db.open(function(err,dbc){*/
				/*if(err){console.log(err)}*/
				/*dbc.collection("crushers",function(err,col){*/
				/*col.insert({title:h2.html(),summary:ad.html(),feature:feature.html()},function(){db.close()})*/
				/*})*/
				/*})*/
			})
	})


function makeurl(old_url,href,callback){
	var num =1;
	var url="";
	var urls = old_url.split("/")
	var hrefs = href.split("/");
	if(hrefs.length==1){
		url=old_url+href
	}else{
		if(hrefs[0]!="http:"){
			if(hrefs[0]==".."){
				for(i in hrefs){
					if(hrefs[i]==".."){
						num+=1
					}
				}
				url = urls[0,urls.length-num].join("/")+"/"+hrefs[num-1,hrefs.length-1].join("/")
			}else{
				url = old_url+"/"+href
			}
		}else{
			url = href
		}
	}
	if(url.split("/")[0]=="http:"){
		url = url.replace("http:","")
	}
	if(url.split("/")[0]!=options.host){
		return false
	}
	if(url.split("/")[url.split("/").length-1]=="index.html"){
		url = url.replace("index.html","")	
	}
	url = url.replace(/(\s|\/)+$/,"")
	callback(url)
}

function _push(array,param){
    var exsit = false
	for(i in array){
		if(array[i]==param){
			exsit = true
		}
	}
	if(!exsit){
		array.push(param)
	}
	return array
}
