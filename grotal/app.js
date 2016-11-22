var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var city = "Surat";
var cityCode = 'C97A0P'
var url = [
                 'http://www.grotal.com/Surat/Flower-Shops-',
                 'http://www.grotal.com/Surat/Hardware-Shops-',
                 'http://www.grotal.com/Surat/Hardware-Dealers-',
                 'http://www.grotal.com/Surat/Hardware-Wholesalers-',
                 'http://www.grotal.com/Surat/Hardware-Material-',
                 'http://www.grotal.com/Surat/Mineral-Water-Distributors-',
                 'http://www.grotal.com/Surat/Pharmaceutical-Distributors-',
                 'http://www.grotal.com/Surat/Coco-Cola-Soft-Drink-Distributors-',
                 'http://www.grotal.com/Surat/Soft-Drink-Distributors-',
                 'http://www.grotal.com/Surat/Newspaper-Distributors-',
                 'http://www.grotal.com/Surat/Medicine-Distributors-',
                 'http://www.grotal.com/Surat/FMCG-Product-Distributors-',
                 'http://www.grotal.com/Surat/Standy-Wholeseller-',
                 'http://www.grotal.com/Surat/Shoe-Dealers-',
                 'http://www.grotal.com/Surat/Grocery-Stores-',
                 'http://www.grotal.com/Surat/Grocery-Wholesalers-',
                 'http://www.grotal.com/Surat/Grocery-Home-Delivery-Services-',
                 'http://www.grotal.com/Surat/Grocery-Distributors-',
                 'http://www.grotal.com/Surat/Printers-',
                 'http://www.grotal.com/Surat/Printer-Dealers-',
                 'http://www.grotal.com/Surat/Stationery-Product-Manufacturers-',
                 'http://www.grotal.com/Surat/Vegetable-Manufacturers-',
                 'http://www.grotal.com/Surat/Dry-Fruit-Wholesalers-',
                 'http://www.grotal.com/Surat/Gift-Retailers-',
                 'http://www.grotal.com/Surat/Homeopathic-Medicine-Retailers-',
                 'http://www.grotal.com/Surat/Allopathic-Medicine-Retailers-'

];

var asyncTasks = [];

console.log("Starting crawling");
for (var i in url ) {
    var urlList = [];
    for (j=1;j<5;j++) {
        var str = cityCode + j +  'A0/'
        urlList.push(url[i] + str);
        //console.log(url[i] + j);
    }
    asyncTasks.push(crawl.bind(null, urlList ));
}

async.parallel(asyncTasks, function(err) {
    if(err) {
        console.log(err);
    }
    console.log("Finished Crawling");
});

function crawl(urlList, callback) {

    var crawlTasks = [];
    for(var i =0; i < urlList.length; i++ ) {
        crawlTasks.push(crawlInternal.bind(null, urlList[i]));
    }
    async.series(crawlTasks, function(err){
        if(err){
            return callback(err);
        }
        callback();
    });

}

function crawlInternal(link, cb) {
    console.log("Begin crawling:- " +link);
    var options = {
            method: 'GET',
            url   :  link,
             headers : {
                'Connection': 'keep-alive',
                'Host'      : 'www.grotal.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            }
        };
    request(options, function(error, response, html ) {
        if(error || response.statusCode != 200){
            console.log(error);
            return cb(error);
        }
        //console.log(html);
        var $ = cheerio.load(html);

        //console.log(cat);
        var appendTasks = [];
        $($(".row")[3]).find('.result-row').each(function(val, element){
            if (!$(this).find(".ph-no-outr").find('.ph-no').html()) {
                return;
            }
            var name = $(this).find(".title").text();
            var area = $(this).find(".area").text();
            var phone = $(this).find(".ph-no-outr").find('.ph-no').html().replace('<br>' , ',');
            var add = $(this).find(".address").text().trim();
            //var ratings = $(this).find(".ipadabove").find(".rt_count").text().replace("Ratings", " ").trim();
            var cat = $($(this).find('.blackA')[0]).text();
            var metadata = {
                name		: 		name,
                cateogory 	: 		cat,
                phone		:       phone,
                city		:  	    city,
                address 	:     	add,
                locality     :  	area,
                source       :      "grotal.com"

            }
            //console.log(metadata);
            if (~metadata.address.indexOf('Surat')) {
                appendTasks.push(appendFile.bind(null, metadata));
            }

        });


        function appendFile(metadata, callback){
            fs.appendFile('data.json', JSON.stringify(metadata,null,4)  + ',\n', function (err) {
                if (err){
                    return callback(err);
                }
                callback();
            });
        }

        async.parallel(appendTasks, function(error){
            if(error){
                console.log(error);
                return cb(error);
            }
            console.log("Done crawling:- " +link);
            cb();
        });

    });

}
