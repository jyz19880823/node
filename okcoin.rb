require "nokogiri"
require "open-uri"
require "json"
price = 0
while true do
  doc = Nokogiri::HTML(open("https://www.okcoin.com/api/ticker.do?symbol=ltc_cny"))
  result = JSON.parse doc.content
  newprice = result["ticker"]["sell"]
  if newprice.to_f > price 
    system "growlnotify -m \"Rising,#{newprice}\""
    price = newprice.to_f
  elsif newprice.to_f < price
    system "growlnotify -m \"downing,#{newprice}\""
    price = newprice.to_f
  else
    system "growlnotify -m \"no change,#{price}\""
  end
  
    sleep 20
end
