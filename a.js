var $ = require('jquery')
var http = require("http")
var html = ""
http.get("http://www.ironorecrusher.net/ore/manganese.html",function(res){
		res.on("data",function(data){html+=data})
		res.on("end",function(){
				var h = $(html)
				h.find("a").each(function($this){
						console.log($(this).attr("href"))
					})
			})
	})
