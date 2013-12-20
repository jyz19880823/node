var growl = require('growl')
/*growl('you have an email',{sticky:true})*/
var request = require('request')
var url = 'https://www.okcoin.com/api/ticker.do?symbol=ltc_cny'
var price = 0
function ok(request,url,price){
request({uri:url},function(err,response,body){
		var result = JSON.parse(response.body)
		var newprice = result.ticker.sell
		if(newprice > price){
			growl(newprice,{title:'Rising',image:'/Users/latpaw/Downloads/favicon.png'})
		}else if(newprice < price){
			growl(newprice,{title:'Downing',image:'~/Downloads/favicon.png'})
		}else{growl(price,{title:'Stable',image:'~/Downloads/favicon.png'})}
	})
}
setInterval(function(){ok(request,url,price)},5000)
