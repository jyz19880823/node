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

var html = '';
var options={
	host:'www.zenithcrusher.com',
	port:'80'
}
var uris = ["www.zenithcrusher.com/products/grinding/mtm-medium-speed-trapezium-mill.html"]

var start =0, //开始的位置
    end = 1;  //结束的位置

	//while(所有uri里的页面均采集并且返回的新的url数量为0)do{
	//do something, 
	//listnumber,
	//end+=listnumber,
	//push dao uri}  //获取本次采集的url数量,加上end值得到新的end值,然后为下一轮使用
	
	//uri.slice(1)
	uri="http://"+uris[0]
http.get(uri,function(res){
		res.on('data',function(d){html+=d});
		res.on('end',function(){
				/*var result=[]*/
				var as = $(html).find("a").each(function($this){
						var href = $(this).attr("href")
						makeurl(uri,href,function(url){
								_push(uris,url)	
							})
					})
				fs.writeFile("hello",uris.join("\r\n"))
				console.log(uris)
			})
	})


function makeurl(old_url,href,callback){
	if(/javascript:|mailto:/.test(href)){return false}
	var num =1;
	var url="";
	var urls = old_url.split("/")
	var hrefs = href.split("/");
	if(hrefs[0]=="."){  // ./file.html
		if(/(html|asp|php)$/.test(urls[urls.length-1])){
			url = urls.slice(0,urls.length-1).join("/")+"/"+hrefs.slice(1)
		}else{
			url=old_url+hrefs.slice(1)
		}
	}else{ //not with a dot beginning
		if(hrefs.length==1){
			if(/(html|asp|php)$/.test(urls[urls.length-1])){ // file.html which only one part and the old url ends with a filename
				url = urls.slice(0,urls.length-1).join("/") +"/" +href
			}else{ //old url ends with dir
				url=old_url+href
			}
		}else{
			if(hrefs[0]!="http:" && hrefs[0]!="https:"){
				if(hrefs[0]==".."){ // path start with ../
					for(i in hrefs){//compute the .. number
						if(hrefs[i]==".."){
							num+=1
						}
					}
					if(/(html|asp|php)$/.test(urls[urls.length-1])){
						url = urls.slice(0,urls.length-num-1).join("/")+"/"+hrefs.slice(num,hrefs.length-1).join("/")
					}else{
						url = urls.slice(0,urls.length-num).join("/")+"/"+hrefs.slice(num,hrefs.length-1).join("/")
					}
				}else{ //start with a path for a/b/c.html
					if(/(html|asp|php)$/.test(urls[urls.length-1])){
						url = urls.slice(0,urls.length-1).join("/")+"/"+href
					}else{
						url = old_url+"/"+href
					}
				}
			}else{
				url = href
			}
		}
	}
	ut = url.split("/")
	if(ut[0]=="http:"){
		url = url.replace("http://","")
	}
	ut = url.split("/")
	if(ut[0]!=options.host){
		return false
	}
	if(/^index\.(html|php|asp)$/.test(ut[ut.length-1])){
		url = url.replace(ut[ut.length-1],"")	
	}

	url = url.replace(/(\s|\/)+$/,"")

	//listnumber+=1    // 本次采集的url数量
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
