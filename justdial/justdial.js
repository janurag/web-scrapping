var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var city = "Surat";
var url = [
                 'http://www.justdial.com/Surat/Flower-Shops/page-',
                 'http://www.justdial.com/Surat/Hardware-Shops/page-',
                 'http://www.justdial.com/Surat/Hardware-Dealers/page-',
                 'http://www.justdial.com/Surat/Hardware-Wholesalers/page-',
                 'http://www.justdial.com/Surat/Hardware-Material-Dealers/page-',
                 'http://www.justdial.com/Surat/Mineral-Water-Distributors/page-',
                 'http://www.justdial.com/Surat/Pharmaceutical-Distributors/page-',
                 'http://www.justdial.com/Surat/Coco-Cola-Soft-Drink-Distributors/page-',
                 'http://www.justdial.com/Surat/Soft-Drink-Distributors/page-',
                 'http://www.justdial.com/Surat/Newspaper-Distributors/page-',
                 'http://www.justdial.com/Surat/Medicine-Distributors/page-',
                 'http://www.justdial.com/Surat/FMCG-Product-Distributors/page-',
                 'http://www.justdial.com/Surat/Standy-Wholeseller/page-',
                 'http://www.justdial.com/Surat/Shoe-Dealers/page-',
                 'http://www.justdial.com/Surat/Grocery-Stores/page-',
                 'http://www.justdial.com/Surat/Grocery-Wholesalers/page-',
                 'http://www.justdial.com/Surat/Grocery-Home-Delivery-Services/page-',
                 'http://www.justdial.com/Surat/Grocery-Distributors/page-',
                 'http://www.justdial.com/Surat/Printers/page-',
                 'http://www.justdial.com/Surat/Printer-Dealers/page-',
                 'http://www.justdial.com/Surat/Stationery-Wholesalers/page-',
                 'http://www.justdial.com/Surat/Vegetable-Wholesalers/page-',
                 'http://www.justdial.com/Surat/Dry-Fruit-Wholesalers/page-',
                 'http://www.justdial.com/Surat/Gift-Retailers/page-',
                 'http://www.justdial.com/Surat/Homeopathic-Medicine-Retailers/page-',
                 'http://www.justdial.com/Surat/Allopathic-Medicine-Retailers/page-',

];

var asyncTasks = [];

console.log("Starting crawling");
for (var i in url ) {
    var urlList = [];
    for (j=1;j<30;j++) {
        urlList.push(url[i] + j);
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
                'Host'      : 'www.justdial.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            }
        };
    request(options, function(error, response, html ) {
        if(error || response.statusCode != 200){
            console.log(error);
            return cb(error);
        }
        var $ = cheerio.load(html);
        var cat = $("#srchbx").attr("value");
        var appendTasks = [];
        $(".cntanr").each(function(val, element){
            var name = $(this).find(".jcn").children("a").html();
            var phone = $(this).find(".contact-info").children().next().text();
            var add = $(this).find(".address-info").children().children().children().text().trim();
            var ratings = $(this).find(".ipadabove").find(".rt_count").text().replace("Ratings", " ").trim();
            var r = /[0-9][0-9][0-9][0-9][0-9][0-9]/
            var locality = add.match(r) || "";
            var metadata = {
                name		: 			name,
                cateogory 	: 		     cat,
                phone		:         phone,
                city		:  			city,
                address 	:     			add,
                //ratings     :  			ratings
                locality    : locality,
                source : "JustDial"


            }
            //console.log(metadata)
            //if (~metadata.address.indexOf('Surat')) {
                appendTasks.push(appendFile.bind(null, metadata));
            //}

        });


        function appendFile(metadata, callback){
            fs.appendFile('jusdialBetter.json', JSON.stringify(metadata,null,4)  + ',\n', function (err) {
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
