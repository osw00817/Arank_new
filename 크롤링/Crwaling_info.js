const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

let link = ['http://anime.onnada.com/4057/nav/quarter','http://anime.onnada.com/4057/nav/quarter','http://anime.onnada.com/4057/nav/quarter']
let aniArray = new Array(); 

for(let i =0;i<3;i++) {
    request(link[i],function(err,res,html){
        let $ = cheerio.load(html);
        let info = new Array();
        let aniInfo = new Object();
        $('div.view-title > h1').each(function()
        {
            let name = $(this).text();
            $('.block').each(function(i)
            {
                if(i < 32) {
                    info.push($(this).text());
                }
                else
                {
                    console.log(info);
                    for(let i = 1;i<info.length;i+=2) {
                        aniInfo[info[i-1]] = info[i];
                    }
                    let key = new Object();
                    key[name] = aniInfo;
                    aniArray.push(key);
                    console.log(JSON.stringify(aniArray));
                    fs.writeFile('text.json',JSON.stringify(aniArray),'utf-8',(err) => console.log(err));
                    return false;
                }
            });
        });
    });
}