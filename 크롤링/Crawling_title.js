const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

request('http://anime.onnada.com/2019.2.php',function(err,res,html) 
{
    if(err) console.log(err);
    let $ = cheerio.load(html);
    let url = [];
    var re = new RegExp(`^http://anime.onnada.com.*nav/quarter$`);
    $('a').each(function(i)
    {
        if(i%2 == 0) {
            let get_url = $(this).attr()['href'];
            if(re.test(get_url) === true)
            {
                console.log(get_url);
            }
        }
    });
})