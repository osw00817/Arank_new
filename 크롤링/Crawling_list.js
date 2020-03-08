const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

request('http://anime.onnada.com/quarter.php',function(err,res,html) 
{
    if(err) console.log(err);
    let $ = cheerio.load(html);
    let url = [];
    var re = new RegExp(`^http://anime.onnada.com.*nav/quarter$`);
    $('.anime-list > ul > li > a').each(function()
    {
        let get_url = $(this).attr()['href'];
        console.log("http://anime.onnada.com/" + get_url);
    });
})