var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var city = 'chandigarh';

var url = [
 'http://yellowpages.sulekha.com/ac-dealers_',
 // 'http://yellowpages.sulekha.com/ac-rentals_',
 // 'http://yellowpages.sulekha.com/ac-services_',
 // 'http://yellowpages.sulekha.com/adhesive-tapes-suppliers_',
 // 'http://yellowpages.sulekha.com/advertising',
 // 'http://yellowpages.sulekha.com/air-compressor-rentals_',
 // 'http://yellowpages.sulekha.com/air-compressors-repair-services_',
 // 'http://yellowpages.sulekha.com/art-carving-services_',
 // 'http://yellowpages.sulekha.com/audio-visual-equipments-sales_',
 // 'http://yellowpages.sulekha.com/audio-visual-equipments-rentals_',
 // 'http://yellowpages.sulekha.com/audio-visual-systems-repairs_',
 // 'http://yellowpages.sulekha.com/bag-manufacturers_',
 // 'http://yellowpages.sulekha.com/barrel-dealers_',
 // 'http://yellowpages.sulekha.com/battery-dealers_',
 // 'http://yellowpages.sulekha.com/battery-rentals_',
 // 'http://yellowpages.sulekha.com/battery-repair-services_chandigarh',
 // 'http://yellowpages.sulekha.com/business-consultancy_',
 // 'http://yellowpages.sulekha.com/cargo-shipping-agents_',
 // 'http://yellowpages.sulekha.com/cctv-services_',
 // 'http://yellowpages.sulekha.com/chiller-repair-services_',
 // 'http://yellowpages.sulekha.com/cleaning-services_',
 // 'http://yellowpages.sulekha.com/cold-storage-units_chandigarh_',
 // 'http://yellowpages.sulekha.com/computer-sales_',
 // 'http://yellowpages.sulekha.com/computer-networking-services_',
 // 'http://yellowpages.sulekha.com/computer-rentals_',
 // 'http://yellowpages.sulekha.com/computer-repair-services_',
 // 'http://yellowpages.sulekha.com/corporate-gifts-suppliers-sales_',
 // 'http://yellowpages.sulekha.com/corporate-internet-service-providers_',
 // 'http://yellowpages.sulekha.com/currency-machine-dealers_',
 // 'http://yellowpages.sulekha.com/design-graphics-services_',
 // 'http://yellowpages.sulekha.com/domestic-cleaning-equipment-suppliers_',
 // 'http://yellowpages.sulekha.com/domestic-courier-delivery-services_',
 // 'http://yellowpages.sulekha.com/drinking-water-suppliers_',
 // 'http://yellowpages.sulekha.com/event-organisers_',
 // 'http://yellowpages.sulekha.com/exhibition-stall-designers_',
 // 'http://yellowpages.sulekha.com/fax-machines_',
 // 'http://yellowpages.sulekha.com/fire-extinguisher-dealers_',
 // 'http://yellowpages.sulekha.com/fire-fighting-equipment-dealers_',
 // 'http://yellowpages.sulekha.com/fire-fighting-equipment-repair-services_',
 // 'http://yellowpages.sulekha.com/fruits-vegetables-nuts-processing-machine-dealers_',
 // 'http://yellowpages.sulekha.com/fumigation-services_',
 // 'http://yellowpages.sulekha.com/housekeeping-services_',
 // 'http://yellowpages.sulekha.com/industrial-dry-cleaners-laundry-services_',
 // 'http://yellowpages.sulekha.com/industrial-electrical-system-services_',
 // 'http://yellowpages.sulekha.com/international-courier-delivery-services_',
 // 'http://yellowpages.sulekha.com/internet-connections-services_',
 // 'http://yellowpages.sulekha.com/inverters_',
 // 'http://yellowpages.sulekha.com/lantern-dealers_',
 // 'http://yellowpages.sulekha.com/magnet-dealers_',
 // 'http://yellowpages.sulekha.com/meat-seafood-poultry-processing-machines_',
 // 'http://yellowpages.sulekha.com/metal-cleaning-services_',
 // 'http://yellowpages.sulekha.com/name-plate-dealers_',
 // 'http://yellowpages.sulekha.com/office-furniture-dealers_',
 // 'http://yellowpages.sulekha.com/office-furniture-rentals_',
 // 'http://yellowpages.sulekha.com/packaging-material-suppliers_',
 // 'http://yellowpages.sulekha.com/paper-roll-manufacturers_',
 // 'http://yellowpages.sulekha.com/paper-shredders-cutters-manufacturers_',
 // 'http://yellowpages.sulekha.com/patent-trade-mark-consultants_',
 // 'http://yellowpages.sulekha.com/pipe-manufacturers_',
 // 'http://yellowpages.sulekha.com/pipeline-works_',
 // 'http://yellowpages.sulekha.com/plumbing-product-suppliers_',
 // 'http://yellowpages.sulekha.com/poultry-farms_',
 // 'http://yellowpages.sulekha.com/press-media-publication-services_',
 // 'http://yellowpages.sulekha.com/printer-dealers_',
 // 'http://yellowpages.sulekha.com/printing-services_',
 // 'http://yellowpages.sulekha.com/product-design-services_',
 // 'http://yellowpages.sulekha.com/production-houses_',
 // 'http://yellowpages.sulekha.com/project-report-thesis-research-papers-consulting-services_',
 // 'http://yellowpages.sulekha.com/projector-dealers_',
 // 'http://yellowpages.sulekha.com/projector-rentals_',
 // 'http://yellowpages.sulekha.com/projector-services_',
 // 'http://yellowpages.sulekha.com/safety-product-providers_',
 // 'http://yellowpages.sulekha.com/scanner-dealers_',
 // 'http://yellowpages.sulekha.com/scanner-repair-services_',
 // 'http://yellowpages.sulekha.com/scrap-second-hand-items_',
 // 'http://yellowpages.sulekha.com/second-hand-equipment-sellers_',
 // 'http://yellowpages.sulekha.com/security-product-dealers_',
 // 'http://yellowpages.sulekha.com/security-systems_',
 // 'http://yellowpages.sulekha.com/ups-sales_',
 // 'http://yellowpages.sulekha.com/vending-machines_',
 // 'http://yellowpages.sulekha.com/vending-machine-rentals_',
 // 'http://yellowpages.sulekha.com/vending-machine-repair-services_chandigarh',
 // 'http://yellowpages.sulekha.com/water-purification-services_',
 // 'http://yellowpages.sulekha.com/water-purifier-dealers_',
 // 'http://yellowpages.sulekha.com/water-purifier-services_',
 // 'http://yellowpages.sulekha.com/weighing-scale-dealers_',
 // 'http://yellowpages.sulekha.com/wireless-security-systems-products_',
 // 'http://yellowpages.sulekha.com/writing-board-dealers_',

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
                cateogory 	: 		  cat,
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
