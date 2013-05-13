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
var fs = require('fs')
var emitter = require('events').EventEmitter;

var options={
	host:'www.latpaw.me',
	port:'80'
}
var uris = ["www.latpaw.me"]

var start =0, //开始的位置
end = 1;  //结束的位置

function get_page(p){
	var n = 0
    var html = '';
	var add = new emitter()
	add.on("complete",function(){
			console.log("complete")
			start +=1
			end += n
			if(start <end){
				get_page("http://"+uris[start])
			}else{
				fs.writeFile("hello",uris.join("\r\n"))
			}
			console.log(start,end)
		})
	http.get(p,function(res){
			console.log(p)
			if(res.statusCode!=200){
				n=0
				add.emit("complete")
				return false
			}
			res.on('data',function(d){html+=d});
			res.on('end',function(){
					var title = $(html).find("title")
					fs.appendFile("title",start+title.text()+"\r\n")
					var as = $(html).find("a").each(function($this){
							var href = $(this).attr("href")
							var nplus = makeurl(p,href,function(url){
									return _push(uris,url)	
								})
							if(nplus){n+=1}
						}).promise().done(function(){add.emit("complete")})
					console.log(n)
				})
		})
}

function makeurl(old_url,href,callback){
	if(/javascript:|mailto:|msnim:/.test(href)){return false}
	var num =0;
	var url="";
	old_url = old_url.replace(/(\s|\/)*$/,"")
	var urls = old_url.split("/")
	var hrefs = href.split("/");

	if(!(/(html|php|asp)$/.test(urls[urls.length-1]))){
		old_url = old_url + "/index.html"
		urls.push("index.html")
	}

	var ul = urls.length
	var hl = hrefs.length

	switch(hrefs[0]){
	case "#":
		return false
		break;
	case "http:":
		url = href
		break;
	case "https:":
		url = href
		break;
	case "":
		url = options.host+href
		break;
	case "..":
		for(i in hrefs){
			if(hrefs[i]==".."){
				num+=1
			}
		}
		url = urls.slice(0,urls.length-num-2).join("/") + "/" +hrefs.slice(num).join("/")
		break;
	case ".":
		url = urls.slice(0,urls.length-1).join("/") + "/" + hrefs.slice(1).join("/")
		break
	default:
		url = urls.slice(0,urls.length-1).join("/") + "/" + href
	}
	/*if(hrefs[0]=="http:" | hrefs[0]=="https:"){*/
	/*url = href*/
	/*}else{*/
	/*if(hrefs[0]==""){*/
	/*url = options.host+href*/
	/*}else{*/
	/*if(hrefs[0]==".."){*/
	/*for(i in hrefs){*/
	/*if(hrefs[i]==".."){num+=1}*/
	/*}*/
	/*url = urls.slice(0,urls.length-num-2).join("/") + "/" +hrefs.slice(num).join("/")*/
	/*}else{*/
	/*if(hrefs[0]=="."){*/
	/*url = urls.slice(0,urls.length-1).join("/") + "/" + hrefs.slice(1).join("/")*/
	/*}else{*/
	/*url = urls.slice(0,urls.length-1).join("/") + "/" + href*/
	/*}*/
	/*}*/
	/*}*/
	/*}*/

	ut = url.split("/")
	if(ut[0]=="http:" | ut[0]=="https://"){
		url = url.replace(/http(s)?:\/\//,"")
	}
	ut = url.split("/")
	if(ut[0]!=options.host){
		return false
	}
	if(/^index\.(html|php|asp)$/.test(ut[ut.length-1])){
		url = url.replace(ut[ut.length-1],"")	
	}

	url = url.replace(/(\s|\/)+$/,"")

	var re =false;
	re = callback(url)
	return re
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
	return !exsit
}



uri = "http://"+uris[start]
get_page(uri)

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
