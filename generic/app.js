var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var querystring = require('query-string');
var async   = require('async');




/**
 *    ╔═╗┌─┐┌┐┌┌─┐┬─┐┬┌─┐      ╔═╗┬─┐┌─┐┬ ┬┬  ┌─┐┬─┐
 *    ║ ╦├┤ │││├┤ ├┬┘││        ║  ├┬┘├─┤││││  ├┤ ├┬┘
 *    ╚═╝└─┘┘└┘└─┘┴└─┴└─┘      ╚═╝┴└─┴ ┴└┴┘┴─┘└─┘┴└─
 */

/**
Sites we are scraping from functions. Please change the cities in each
of the crawling function. All changing variables are globally defined in the
respective functions
*/

zomato();
//justdial();
//sulekha();
//grotal();
//localdiaries();

function zomato() {

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
}

function justdial(){

    var city = "Chandigarh";
    var url = [
                     'http://www.justdial.com/Chandigarh/Flower-Shops/page-',
                     'http://www.justdial.com/Chandigarh/Hardware-Shops/page-',
                     'http://www.justdial.com/Chandigarh/Hardware-Dealers/page-',
                     'http://www.justdial.com/Chandigarh/Hardware-Wholesalers/page-',
                     'http://www.justdial.com/Chandigarh/Hardware-Material-Dealers/page-',
                     'http://www.justdial.com/Chandigarh/Mineral-Water-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Pharmaceutical-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Coco-Cola-Soft-Drink-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Soft-Drink-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Newspaper-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Medicine-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/FMCG-Product-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Standy-Wholeseller/page-',
                     'http://www.justdial.com/Chandigarh/Shoe-Dealers/page-',
                     'http://www.justdial.com/Chandigarh/Grocery-Stores/page-',
                     'http://www.justdial.com/Chandigarh/Grocery-Wholesalers/page-',
                     'http://www.justdial.com/Chandigarh/Grocery-Home-Delivery-Services/page-',
                     'http://www.justdial.com/Chandigarh/Grocery-Distributors/page-',
                     'http://www.justdial.com/Chandigarh/Printers/page-',
                     'http://www.justdial.com/Chandigarh/Printer-Dealers/page-',
                     'http://www.justdial.com/Chandigarh/Stationery-Wholesalers/page-',
                     'http://www.justdial.com/Chandigarh/Vegetable-Wholesalers/page-',
                     'http://www.justdial.com/Chandigarh/Dry-Fruit-Wholesalers/page-',
                     'http://www.justdial.com/Chandigarh/Gift-Retailers/page-',
                     'http://www.justdial.com/Chandigarh/Homeopathic-Medicine-Retailers/page-',
                     'http://www.justdial.com/Chandigarh/Allopathic-Medicine-Retailers/page-',

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
                var locality = "";
                if (add.match(r)) {
                    locality = add.match(r).join();
                }

                var metadata = {
                    name		:     name,
                    category 	:     cat,
                    phone		:     phone,
                    city		:  	  city,
                    address 	:     add,
                    //ratings     :  			ratings
                    locality    : locality,
                    source      : "JustDial"


                }
                //console.log(metadata)
                //if (~metadata.address.indexOf('Surat')) {
                    appendTasks.push(appendFile.bind(null, metadata));
                //}

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

}

function sulekha() {

    var city = 'gurgaon';

    var url = [
     'http://yellowpages.sulekha.com/ac-dealers_',
     'http://yellowpages.sulekha.com/ac-rentals_',
     'http://yellowpages.sulekha.com/ac-services_',
     'http://yellowpages.sulekha.com/adhesive-tapes-suppliers_',
     'http://yellowpages.sulekha.com/advertising',
     'http://yellowpages.sulekha.com/air-compressor-rentals_',
     'http://yellowpages.sulekha.com/air-compressors-repair-services_',
     'http://yellowpages.sulekha.com/art-carving-services_',
     'http://yellowpages.sulekha.com/audio-visual-equipments-sales_',
     'http://yellowpages.sulekha.com/audio-visual-equipments-rentals_',
     'http://yellowpages.sulekha.com/audio-visual-systems-repairs_',
     'http://yellowpages.sulekha.com/bag-manufacturers_',
     'http://yellowpages.sulekha.com/barrel-dealers_',
     'http://yellowpages.sulekha.com/battery-dealers_',
     'http://yellowpages.sulekha.com/battery-rentals_',
     'http://yellowpages.sulekha.com/battery-repair-services_',
     'http://yellowpages.sulekha.com/business-consultancy_',
     'http://yellowpages.sulekha.com/cargo-shipping-agents_',
     'http://yellowpages.sulekha.com/cctv-services_',
     'http://yellowpages.sulekha.com/chiller-repair-services_',
     'http://yellowpages.sulekha.com/cleaning-services_',
     'http://yellowpages.sulekha.com/cold-storage-units_',
     'http://yellowpages.sulekha.com/computer-sales_',
     'http://yellowpages.sulekha.com/computer-networking-services_',
     'http://yellowpages.sulekha.com/computer-rentals_',
     'http://yellowpages.sulekha.com/computer-repair-services_',
     'http://yellowpages.sulekha.com/corporate-gifts-suppliers-sales_',
     'http://yellowpages.sulekha.com/corporate-internet-service-providers_',
     'http://yellowpages.sulekha.com/currency-machine-dealers_',
     'http://yellowpages.sulekha.com/design-graphics-services_',
     'http://yellowpages.sulekha.com/domestic-cleaning-equipment-suppliers_',
     'http://yellowpages.sulekha.com/domestic-courier-delivery-services_',
     'http://yellowpages.sulekha.com/drinking-water-suppliers_',
     'http://yellowpages.sulekha.com/event-organisers_',
     'http://yellowpages.sulekha.com/exhibition-stall-designers_',
     'http://yellowpages.sulekha.com/fax-machines_',
     'http://yellowpages.sulekha.com/fire-extinguisher-dealers_',
     'http://yellowpages.sulekha.com/fire-fighting-equipment-dealers_',
     'http://yellowpages.sulekha.com/fire-fighting-equipment-repair-services_',
     'http://yellowpages.sulekha.com/fruits-vegetables-nuts-processing-machine-dealers_',
     'http://yellowpages.sulekha.com/fumigation-services_',
     'http://yellowpages.sulekha.com/housekeeping-services_',
     'http://yellowpages.sulekha.com/industrial-dry-cleaners-laundry-services_',
     'http://yellowpages.sulekha.com/industrial-electrical-system-services_',
     'http://yellowpages.sulekha.com/international-courier-delivery-services_',
     'http://yellowpages.sulekha.com/internet-connections-services_',
     'http://yellowpages.sulekha.com/inverters_',
     'http://yellowpages.sulekha.com/lantern-dealers_',
     'http://yellowpages.sulekha.com/magnet-dealers_',
     'http://yellowpages.sulekha.com/meat-seafood-poultry-processing-machines_',
     'http://yellowpages.sulekha.com/metal-cleaning-services_',
     'http://yellowpages.sulekha.com/name-plate-dealers_',
     'http://yellowpages.sulekha.com/office-furniture-dealers_',
     'http://yellowpages.sulekha.com/office-furniture-rentals_',
     'http://yellowpages.sulekha.com/packaging-material-suppliers_',
     'http://yellowpages.sulekha.com/paper-roll-manufacturers_',
     'http://yellowpages.sulekha.com/paper-shredders-cutters-manufacturers_',
     'http://yellowpages.sulekha.com/patent-trade-mark-consultants_',
     'http://yellowpages.sulekha.com/pipe-manufacturers_',
     'http://yellowpages.sulekha.com/pipeline-works_',
     'http://yellowpages.sulekha.com/plumbing-product-suppliers_',
     'http://yellowpages.sulekha.com/poultry-farms_',
     'http://yellowpages.sulekha.com/press-media-publication-services_',
     'http://yellowpages.sulekha.com/printer-dealers_',
     'http://yellowpages.sulekha.com/printing-services_',
     'http://yellowpages.sulekha.com/product-design-services_',
     'http://yellowpages.sulekha.com/production-houses_',
     'http://yellowpages.sulekha.com/project-report-thesis-research-papers-consulting-services_',
     'http://yellowpages.sulekha.com/projector-dealers_',
     'http://yellowpages.sulekha.com/projector-rentals_',
     'http://yellowpages.sulekha.com/projector-services_',
     'http://yellowpages.sulekha.com/safety-product-providers_',
     'http://yellowpages.sulekha.com/scanner-dealers_',
     'http://yellowpages.sulekha.com/scanner-repair-services_',
     'http://yellowpages.sulekha.com/scrap-second-hand-items_',
     'http://yellowpages.sulekha.com/second-hand-equipment-sellers_',
     'http://yellowpages.sulekha.com/security-product-dealers_',
     'http://yellowpages.sulekha.com/security-systems_',
     'http://yellowpages.sulekha.com/ups-sales_',
     'http://yellowpages.sulekha.com/vending-machines_',
     'http://yellowpages.sulekha.com/vending-machine-rentals_',
     'http://yellowpages.sulekha.com/vending-machine-repair-services_',
     'http://yellowpages.sulekha.com/water-purification-services_',
     'http://yellowpages.sulekha.com/water-purifier-dealers_',
     'http://yellowpages.sulekha.com/water-purifier-services_',
     'http://yellowpages.sulekha.com/weighing-scale-dealers_',
     'http://yellowpages.sulekha.com/wireless-security-systems-products_',
     'http://yellowpages.sulekha.com/writing-board-dealers_',

    ];

    var asyncTasks = [];

    console.log("Starting crawling");
    for (var i in url ) {
        var urlList = [];
        for (j=1;j<10;j++) {
            urlList.push(url[i] + city + '_' + j);
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
        for(var i = 0; i < urlList.length; i++ ) {
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
                    //'Host'      : 'www.yellowpages.sulekha.com',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
                }
            };
        request(options, function(error, response, html ) {
            if(error || response.statusCode != 200){
                console.log(error);
                return cb(error);
            }
            var link = options.url;
            var $ = cheerio.load(html);
            //var cat = $("#srchbx").attr("value");
            var appendTasks = [];
            $(".list-group").find('.list-item').each(function(val, element){
                var name = $(this).children('h3').text().trim();
                var phone = $(this).find('.contact-number').text().trim();
                var add = $(this).find('.contact-number').next().text().trim().replace('- Get Directions','');
                var cat = link.slice(link.lastIndexOf('/')+1, link.indexOf('_'));
                var locality = add.slice(add.length-7, add.length).trim();
                //var ratings = $(this).find(".ipadabove").find(".rt_count").text().replace("Ratings", " ").trim();

                var metadata = {
                    name		:         name,
                    category 	: 		  cat,
                    phone		:         phone,
                    city		:  		  city,
                    address 	:         add,
                    locality    :         locality,
                    source      :         "Sulekha"
                    //ratings     :  			ratings
                }
                //console.log(metadata)
                //if (~metadata.address.indexOf('Nagpur')) {
                    appendTasks.push(appendFile.bind(null, metadata));
                //}

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

}

function grotal() {

    var city = "Gurgaon-NCR";
    var cityCode = 'C51A0P'
    var url =[
        'http://www.grotal.com/Gurgaon-NCR/Flowers-Home-Delivery-',
        'http://www.grotal.com/Gurgaon-NCR/Hardware-Shops-',
        'http://www.grotal.com/Gurgaon-NCR/Hardware-Dealers-',
        'http://www.grotal.com/Gurgaon-NCR/Hardware-Wholesalers-',
        'http://www.grotal.com/Gurgaon-NCR/Hardware-Material-',
        'http://www.grotal.com/Gurgaon-NCR/Mineral-Water',
        'http://www.grotal.com/Gurgaon-NCR/Pharmaceuticals-',
        'http://www.grotal.com/Gurgaon-NCR/Coco-Cola-Soft-Drink-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/Soft-Drink-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/Newspaper-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/Medicine-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/FMCG-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/Second-Hand-Spare-Parts',
        'http://www.grotal.com/Gurgaon-NCR/Grocery-Shops',
        'http://www.grotal.com/Gurgaon-NCR/Grocery-Stores-',
        'http://www.grotal.com/Gurgaon-NCR/Grocery-Items-',
        'http://www.grotal.com/Gurgaon-NCR/Grocery-Home-Delivery-',
        'http://www.grotal.com/Gurgaon-NCR/Grocery-Distributors-',
        'http://www.grotal.com/Gurgaon-NCR/Print-Papers-',
        'http://www.grotal.com/Gurgaon-NCR/Printer-',
        'http://www.grotal.com/Gurgaon-NCR/Printer-Repair-',
        'http://www.grotal.com/Gurgaon-NCR/Stationery-Items-',
        'http://www.grotal.com/Gurgaon-NCR/Stationery-Shops-',
        'http://www.grotal.com/Gurgaon-NCR/Stationery-Goods-',
        'http://www.grotal.com/Gurgaon-NCR/Vegetable-Shops-',
        'http://www.grotal.com/Gurgaon-NCR/Vegetable-Traders',
        'http://www.grotal.com/Gurgaon-NCR/Vegetables-Home-Delivery-',
        'http://www.grotal.com/Gurgaon-NCR/Dry-Fruits-',
        'http://www.grotal.com/Gurgaon-NCR/Drycleaners-',
        'http://www.grotal.com/Gurgaon-NCR/Gift-Items-',
        'http://www.grotal.com/Gurgaon-NCR/Gift-Shops-',
        'http://www.grotal.com/Gurgaon-NCR/Homeopathic-Medicine-Wholesalers-',
        'http://www.grotal.com/Gurgaon-NCR/Allopathic-Medicines-',

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
                    category 	: 		cat,
                    phone		:       phone,
                    city		:  	    city,
                    address 	:     	add,
                    locality     :  	area,
                    source       :      "grotal.com"

                }
                //console.log(metadata);
                // if (~metadata.address.indexOf('Nagpur')) {
                     appendTasks.push(appendFile.bind(null, metadata));
                // }

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

}

function localdiaries() {
    var url = [];

    var city = "Gurgaon";
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
                    'Host'      : 'www.localdiaries.in',
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


}
