var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var url = [];

var city = "nagpur/restaurants";

function main (){
        city = city;
        start = 1;
        end = 75;
        urlGenrator(city, start, end, function() {
                crawler();
        });
};

function urlGenrator(city, start, end, callback) {
    // var post_data = {
    //
    // }
    // var options = {
    //         method: 'POST',
    //         url   :  'http://www.localdiaries.in/records/loadmore',
    //          headers : {
    //             'Connection': 'keep-alive',
    //             // 'Host'      : 'www.justdial.com',
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //             //  'Content-Length': Buffer.byteLength(post_data),
    //             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    //         }
    //     };
        for (i = start; i<end ; i++) {
                url.push('https://www.zomato.com/'+ city +'?page=' + i);
        }
        callback();
};


function crawler() {
        for (var i in url ) {
                request(url[i], function(error, response, html ) {
                        if (error) {
                            console.log(error);
                        }
                        var $ = cheerio.load(html);
                        var cat = "Restaurant";
                        $(".card.search-snippet-card.search-card ").each(function(val, element){
                            var name = $(this).find(".content").find(".result-title").text().trim();
                            var category = $(this).find(".content").find(".res-snippet-small-establishment").text().trim();
                            var rating = $(this).find(".content").find(".rating-popup").text().trim();
                            var reviews = $(this).find(".content").find(".result-reviews").text().trim();
                            var address = $(this).find(".content").find(".search-result-address").text().trim();
                            var phone = $(this).find(".res-snippet-ph-info").attr("data-phone-no-str");
                            var locality = $(this).find(".content").find(".search-page-text").find('b').text().trim();
                            var homeDelivery;
                            if ($(this).find(".o2_link")['0']) {
                                homeDelivery = "Yes";
                            } else {
                                homeDelivery = "No";
                            }
                            var metadata = {
                                name: name,
                                category: category,
                                phone   : phone,
                                city    : city,
                                //rating : rating,
                                //reviews : reviews,
                                address : address,
                                //homeDelivery : homeDelivery
                                locality : locality,
                                source : "Zomato"
                                };


                            fs.appendFile ('zomato.json', JSON.stringify(metadata,null,4)  + ',\n', function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log(name);

                            });
                        });

            });
        }

}

main();
