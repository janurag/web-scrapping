var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var url = [
                 'http://www.grotal.com/Surat/Flower-Shops-C97A0P',
                 'http://www.grotal.com/Surat/Hardware-Shops-C97A0P',
                 'http://www.grotal.com/Surat/Hardware-Dealers-C97A0P',
                 'http://www.grotal.com/Surat/Hardware-Wholesalers-C97A0P',
                 'http://www.grotal.com/Surat/Hardware-Material-C97A0P',
                 'http://www.grotal.com/Surat/Mineral-Water-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Pharmaceutical-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Coco-Cola-Soft-Drink-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Soft-Drink-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Newspaper-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Medicine-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/FMCG-Product-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Standy-Wholeseller-C97A0P',
                 'http://www.grotal.com/Surat/Shoe-Dealers-C97A0P',
                 'http://www.grotal.com/Surat/Grocery-Stores-C97A0P',
                 'http://www.grotal.com/Surat/Grocery-Wholesalers-C97A0P',
                 'http://www.grotal.com/Surat/Grocery-Home-Delivery-Services-C97A0P',
                 'http://www.grotal.com/Surat/Grocery-Distributors-C97A0P',
                 'http://www.grotal.com/Surat/Printers-C97A0P',
                 'http://www.grotal.com/Surat/Printer-Dealers-C97A0P',
                 'http://www.grotal.com/Surat/Stationery-Wholesalers-C97A0P',
                 'http://www.grotal.com/Surat/Vegetable-Wholesalers-C97A0P',
                 'http://www.grotal.com/Surat/Dry-Fruit-Wholesalers-C97A0P',
                 'http://www.grotal.com/Surat/Gift-Retailers-C97A0P',
                 'http://www.grotal.com/Surat/Homeopathic-Medicine-Retailers-C97A0P',
                 'http://www.grotal.com/Surat/Allopathic-Medicine-Retailers-C97A0P'

];

var asyncTasks = [];

console.log("Starting crawling");
for (var i in url ) {
    var urlList = [];
    for (j=1;j<5;j++) {
        var str = j + 'A0/'
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
                city		:  	    "Surat",
                address 	:     	add,
                area     :  	    area

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
