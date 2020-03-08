const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
//const link = `http://anime.onnada.com/2015.4.php`
const link = new Array();
for(let i = 1;i<=4;i++){
    link.push(`http://anime.onnada.com/2013.${i}.php`)
}

for(let a = 0;a<link.length;a++)
{
    request(link[a],function(err,res,html) 
    {
        let db = [];
        let name = link[a].replace('http://anime.onnada.com/','').split('.');
        let 출시년도 = name[0];
        let 출시분기 = name[1];
        let $ = cheerio.load(html);
        var re = new RegExp(`^http://anime.onnada.com.*nav/quarter$`);
        $('a').each(function() 
        {
            //
            let link = $(this).attr()['href'];
            if(re.test(link) === true)
            {
            request(link,function(err,res,html){
            let $ = cheerio.load(html);
            let info = new Array();
            let aniInfo = new Object();
            $('div.view-title > h1').each(function()
            {
                let 제목 = $(this).text();
                $('#animeContents').each(function() 
                {
                    aniInfo['제목'] = 제목;
                    aniInfo['줄거리'] = $(this).text();
                    db.push(aniInfo);
                    fs.writeFile(`줄거리/${출시년도}년${출시분기}분기.json`,JSON.stringify(db),'utf-8',(err) => console.log("aaa" + err));
            })
        });
    })}})})}