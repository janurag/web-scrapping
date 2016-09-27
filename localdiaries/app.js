var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var querystring = require('query-string');
var url = [];

var city = "Chandigarh";
var cat = "Restaurant";

function main (){
        title = "Restaurants";
        city = city;
        page_start = 1;
        page_end   = 50;
        urlGenrator(city, title, page_start,page_end, function() {
                crawler();
        });
};

function urlGenrator(city, title, page_start,page_end, callback) {
    for (var i = page_start; i<page_end ; i++) {
        var page = i
        var post_data = querystring.stringify({
            'city': city,
            'title' : title,
            'page' : page
        });
        var options = {
            method: 'POST',
            url   :  'http://www.localdiaries.in/records/loadmore',
            headers : {
                'Connection': 'keep-alive',
                // 'Host'      : 'www.justdial.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Content-Length': Buffer.byteLength(post_data),
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            },
            body:  post_data

        };
        url.push(options);
    }
    callback();
};


function crawler() {
        for (var i in url ) {
            //console.log('Crawling link - ' + url[i].url + url[i].body );
                request(url[i], function(error, response, html ) {
                        if (error) {
                            console.log(error);
                        }
                        //console.log(html)
                        //console.log('Crawling link - ' + url[i].url + url[i].body );
                        var $ = cheerio.load(html);
                        $('.onerow.clearfix.productwrap ').each(function(val, element){
                            var name = $($(this).find('.headingss1').children()[0]).text().trim();
                            //var category = $(this).find(".content").find(".res-snippet-small-establishment").text().trim();
                            //var rating = $(this).find(".content").find(".rating-popup").text().trim();
                            //var reviews = $(this).find(".content").find(".result-reviews").text().trim();
                            var address = $(this).find('.address-detail').text().trim().replace('\n\t\t\t\t\t   View Map', '');
                            var phone = $(this).find('.address-detail').next().text().trim();
                            var locality = address.slice(address.length-7, address.length);
                            // if ($(this).find(".o2_link")['0']) {
                            //     homeDelivery = "Yes";
                            // } else {
                            //     homeDelivery = "No";
                            // }
                            var metadata = {
                                name: name,
                                category : cat,
                                phone   : phone,
                                city    : city,
                                address : address,
                                locality : locality,
                                source   : "localdiaries.in"

                            };


                            fs.appendFile ('data.json', JSON.stringify(metadata,null,4)  + ',\n', function (err) {
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
