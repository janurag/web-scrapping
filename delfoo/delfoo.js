var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var mainUrl = 'http://delfoo.com/index.php?route=catalog/search/vendor&filter_name=&limit=5';

var crawlTasks = [];
var opts = {};
opts.mainUrl = mainUrl;

crawlTasks.push(fetchLinks.bind(null, opts));
crawlTasks.push(fetchInfo.bind(null, opts));

async.series(crawlTasks, function(error){
    if (error) {
        console.log(error);
    }
    console.log('Done crawling')
});

function fetchLinks(opts, callback) {
    var url = opts.mainUrl;
    var secUrl = [];
    console.log("Begin crawling:- " +url);
    request(url, function(error, response, html ) {
        if (error || response.statusCode != 200) {
            console.log(error);
            return callback(error);
        }
        var $ = cheerio.load(html);
        //console.log(html);
        var restaurantArray = $('.thumbnail.df-darken-card.df-list-row').children();
        //console.log(restaurantArray);
        $(restaurantArray).each(function(val, element){
            if ($(this).attr('class')== 'thumbnail'){
                var link = $(this).attr('href');
                secUrl.push(link);
            }
        });
        opts.secondUrls = secUrl;
        callback();
    });

}

function fetchInfo(opts, callback) {
    var restaurantArray = opts.secondUrls
    var secondPageCrawl = [];
    for (var i in restaurantArray) {
        secondPageCrawl.push(crawlSecondPage.bind(null,restaurantArray[i]))
    }
    async.parallel(secondPageCrawl, function(error){
        if (error) {
            return callback(error);
        }
        callback();
    });
    function crawlSecondPage(url, callback) {
        console.log("Crawling Restaurant Page- " +url);
        request(url, function(error, response, html ) {
            if (error || response.statusCode != 200) {
                console.log(error);
                return callback(error);
            }
            var $ = cheerio.load(html);
            var name = $('.titleBox').find('.col-lg-10.col-md-12.col-sm-12.col-xs-12').find('.bigger').text().trim();
            var address = $('.titleBox').find('.col-lg-10.col-md-12.col-sm-12.col-xs-12').find('.big').text().replace(/\s+/g, ' ');
            var cateogory = $($('.titleBox').find('.col-lg-10.col-md-12.col-sm-12.col-xs-12').find('.big').next().find('span')[0]).text();
            var deliveryTime = $($('.titleBox').find('.col-lg-10.col-md-12.col-sm-12.col-xs-12').find('.big').next().find('span')[3]).text();
            var metadata = {
                    name : name,
                    address: address,
                    cateogory: cateogory,
                    deliveryTime: deliveryTime
            };
            //console.log(metadata);
            fs.appendFile ('delfoo.json', JSON.stringify(metadata,null,4)  + ',\n', function (err) {
                if (err) {
                    callback(err);
                }
                callback();
            });
        });
    }

}
