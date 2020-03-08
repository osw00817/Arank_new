const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'arank'
})
conn.connect();

//const link = `http://anime.onnada.com/2015.4.php`
const link = new Array();
for(let i = 1;i<=4;i++){
    link.push(`http://anime.onnada.com/2017.${i}.php`)
}

for(let a = 0;a<link.length;a++)
{
    request(link[a],function(err,res,html) 
    {
        let name = link[a].replace('http://anime.onnada.com/','').split('.');
        let 출시년도 = name[0];
        let 출시분기 = name[1];
        let $ = cheerio.load(html);
        var re = new RegExp(`^http://anime.onnada.com.*nav/quarter$`);
        $('a').each(function(i) 
        {
            if(i%2 == 0) {
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
                            $('#animeContents').each(function() 
                            {
                                aniInfo['img'] = 사진링크;
                                aniInfo['제목'] = 제목;
                                for(let i = 1;i<info.length;i+=2) {
                                    aniInfo[info[i-1]] = info[i];
                                }
                                aniInfo['줄거리'] = $(this).text();
                                aniInfo['출시년도'] = 출시년도;
                                aniInfo['출시분기'] = 출시분기;
                                conn.query('select * from ani_info where 제목=?',[aniInfo['제목']],(err,result) => {
                                    if(result.length == 0) {
                                        conn.query('INSERT ani_info (`제목`, `출시년도`, `출시 분기`, `img`, `원제`, `원작`, `감독`, `각본`, `캐릭터 디자인`, `음악`, `제작사`, `장르`, `분류`, `키워드`, `제작 국가`, `방영일`, `등급`, `총화수`, `공식 홈페이지`, `공식 트위터`, `추천`, `줄거리`, `추천수`) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ? , 0);',
                                        [aniInfo["제목"],aniInfo["출시년도"],aniInfo["출시분기"],aniInfo["img"],aniInfo["원제"],aniInfo["원작"],aniInfo["감독"],aniInfo["각본"],aniInfo["캐릭터 디자인"],aniInfo["음악"],aniInfo["제작사"],aniInfo["장르"],aniInfo["분류"],aniInfo["키워드"],aniInfo["제작국가"],aniInfo["방영일"],aniInfo["등급"],aniInfo["총화수"],aniInfo["공식홈페이지"],aniInfo["공식트위터"],aniInfo["줄거리"]],
                                        (err,results) => {
                                            if(err) console.log(err);
                                            console.log(aniInfo["제목"]+"등록 완료")
                                        });
                                    }
                                    else {
                                        console.log("에러에러"+result.length);
                                    }
                                })
                            })
                            return false;
                        }
                    });
                })
            });
        })}
            }
})})}