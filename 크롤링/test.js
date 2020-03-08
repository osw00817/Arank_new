const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
//const link = `http://anime.onnada.com/2015.4.php`
const link = new Array();
for(let i = 3;i<=4;i++){
    link.push(`http://anime.onnada.com/2014.${i}.php`)
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
            //#animeContents
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
                $('.view-info > .image > div > a > img').each(function() {
                    let 사진링크 = $(this).attr()['src'];
                    $('.block').each(function(i)
                    {
                    if(i < 32) 
                    {
                        info.push($(this).text());
                    }
                    else
                    {
                        aniInfo['제목'] = 제목;
                        aniInfo['사진링크'] = 사진링크;
                        aniInfo['출시년도'] = 출시년도;
                        aniInfo['출시분기'] = 출시분기;
                        for(let i = 1;i<info.length;i+=2) {
                            aniInfo[info[i-1]] = info[i];
                        }
                        db.push(aniInfo);
                        fs.writeFile(`ani/${출시년도}년${출시분기}분기.json`,JSON.stringify(db),'utf-8',(err) => console.log("aaa" + err));
                        return false;
                    }
                });
            })
        });
    })}})})}