var fs = require('fs');
//var S = require('string');
var request = require('request');
var cheerio = require('cheerio');
var options = [];


/*
    Change the city to fetch it's data
*/
var city = "nagpur/restaurants";

/*
    Scraping pages
*/
function main (){
        city = city;
        start = 1;
        end = 75;
        urlGenrator(city, start, end, function() {
                crawler();
        });
};


/*
If the script is not working try copying the latest cookie header and paste
it in the cookie field
*/

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
                var headers = {
                    'authority' : 'www.zomato.com',
                    'method' : 'GET',
                    'path' : '/nagpur/restaurants?page='+i,
                    // 'scheme' : 'https',
                    'accept-language' : 'en-US,en;q=0.8',
                    'cache-control' : 'max-age=0',
                    'cookie' : 'dpr=1; fbm_288523881080=base_domain=.zomato.com; zl=en; fbtrack=23089b8d61a8be5040940ef4abb79108; fbcity=33; PHPSESSID=f664c9b8f8b33a513ab8e32bc24268bbfd2feab9; zhli=1; squeeze=fb3097db83995da0356d3daf6b42071a; orange=8041131; LEL_JS=true; _gat_country=1; _gat_global=1; fbsr_288523881080=VTiMoWRBMJBy5FLqdBhz3IpzKMVUGR2QzIiwCWNC8Y4.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUFkdkVSdUtpRkdrTWtkYXIzT2ZRMThhWWtTR3NTX0hMS1dnc19QcFp5SmFXQ2Vqa0JKbEVSQllYMUthcVNNRFczbkNxZG1CZjl3ZGVWelozWXl1TU1way1ILTdLUDVncTlXWjhpSUFKdE5aenFvWWNadVNyNG8wb3BBeHlhdUxWNG81a3p0ZEZleEJzUW16TnVPNmIwd0FNZUtSaFZqOFAzdElOOTV1VDdHRWhBQTUtbUU1V25PbnE5aEZKYkQ4X0Nia21IYVZGaWVWeWFGMm9PWXNrRjRZWEdjbzdMT0tWUzVNRUdwZnY4cVc5NmxIRzA1T29wcjV1UUdYTVdpRWdZWVVZWElxV2FDUEQ5eHh6dndvdnNNY3ZFVzNROVRENC1XUXZCU1htZTZWSU9tTFFMVU5ocHdnZ0dCSnB0Ymx6Y2JGdV83S1VJQUxrVWNOMm81aVFIRCIsImlzc3VlZF9hdCI6MTQ3OTg3Njg5NiwidXNlcl9pZCI6IjExMDQxMzM5MjI5OTAzODcifQ; _ga=GA1.2.145407042.1474365044; __jpuri=https%3A//www.zomato.com/nagpur/restaurants%3Fpage%3D1; ak_bmsc=51C92A93980C9B70F46E05E70B03DCFF170F213C637E00008B1E355872D7DB36~plpj0jn7/2pAFm4bwqXbHfHA5EapvsnEKpOQeHfnAdKqo2YRTgqVPnxIwivOSIZdJcZhwvR5cehM3dMn78KFHwmW4NgKvVmfps0Kmm/RAFO8I5q1nBIybdY1roP7JOSs4zKqHTbF6LZqz0ki62eLnz/pj4hs0bQjVzCcmPLfzMAfbqBU0y/htGWE+8V/i1/y4iRVldlrXWYDIGoJLy8RG/pA==',
                    'upgrade-insecure-requests' : '1',
                    'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'

                };
                var option = {
                    method : 'GET',
                    url : 'http://www.zomato.com/'+ city +'?page=' + i,
                    headers : headers
                };
                options.push(option);
        }
        callback();
};


function crawler() {
        for (var i in options ) {
            // var temp = {
            //     method: 'GET',
            //     url: 'http://www.zomato.com/nagpur/restaurants?page=3',
            //     headers:
            //        {
            //          'authority': 'www.zomato.com',
            //          'method': 'GET',
            //          'path': '/nagpur/restaurants?page=3',
            //         //   'scheme': 'http',
            //          'accept-language': 'en-US,en;q=0.8',
            //          'cache-control': 'max-age=0',
            //          'cookie' : 'dpr=1; fbm_288523881080=base_domain=.zomato.com; zl=en; fbtrack=23089b8d61a8be5040940ef4abb79108; fbcity=33; PHPSESSID=f664c9b8f8b33a513ab8e32bc24268bbfd2feab9; zhli=1; squeeze=fb3097db83995da0356d3daf6b42071a; orange=8041131; LEL_JS=true; _gat_country=1; _gat_global=1; fbsr_288523881080=VTiMoWRBMJBy5FLqdBhz3IpzKMVUGR2QzIiwCWNC8Y4.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUFkdkVSdUtpRkdrTWtkYXIzT2ZRMThhWWtTR3NTX0hMS1dnc19QcFp5SmFXQ2Vqa0JKbEVSQllYMUthcVNNRFczbkNxZG1CZjl3ZGVWelozWXl1TU1way1ILTdLUDVncTlXWjhpSUFKdE5aenFvWWNadVNyNG8wb3BBeHlhdUxWNG81a3p0ZEZleEJzUW16TnVPNmIwd0FNZUtSaFZqOFAzdElOOTV1VDdHRWhBQTUtbUU1V25PbnE5aEZKYkQ4X0Nia21IYVZGaWVWeWFGMm9PWXNrRjRZWEdjbzdMT0tWUzVNRUdwZnY4cVc5NmxIRzA1T29wcjV1UUdYTVdpRWdZWVVZWElxV2FDUEQ5eHh6dndvdnNNY3ZFVzNROVRENC1XUXZCU1htZTZWSU9tTFFMVU5ocHdnZ0dCSnB0Ymx6Y2JGdV83S1VJQUxrVWNOMm81aVFIRCIsImlzc3VlZF9hdCI6MTQ3OTg3Njg5NiwidXNlcl9pZCI6IjExMDQxMzM5MjI5OTAzODcifQ; _ga=GA1.2.145407042.1474365044; __jpuri=https%3A//www.zomato.com/nagpur/restaurants%3Fpage%3D1; ak_bmsc=51C92A93980C9B70F46E05E70B03DCFF170F213C637E00008B1E355872D7DB36~plpj0jn7/2pAFm4bwqXbHfHA5EapvsnEKpOQeHfnAdKqo2YRTgqVPnxIwivOSIZdJcZhwvR5cehM3dMn78KFHwmW4NgKvVmfps0Kmm/RAFO8I5q1nBIybdY1roP7JOSs4zKqHTbF6LZqz0ki62eLnz/pj4hs0bQjVzCcmPLfzMAfbqBU0y/htGWE+8V/i1/y4iRVldlrXWYDIGoJLy8RG/pA==',
            //          'upgrade-insecure-requests': '1',
            //          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
            //      }
            //  }
            request(options[i], function(error, response, html ) {
                        if (error) {
                            console.log(error);
                        }
                        var $ = cheerio.load(html);
                        // console.log(html);
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
                                rating : rating,
                                reviews : reviews,
                                address : address,
                                homeDelivery : homeDelivery,
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
