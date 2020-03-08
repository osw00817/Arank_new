let express = require('express');
let router = express.Router();
const mysql = require('mysql');
const conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'arank'
})
conn.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  const name = decodeURI( req.originalUrl.split('/')[2]);
  conn.query(`select DISTINCT * from ani_info where 제목="${name}"`,(err,result) =>{
    let star = result[0]['추천'] / result[0]['추천수'];
    console.log(star);
    conn.query(`select id,등록작품id,등록자닉네임,등록자id,평점,평론,date_format(등록날짜,'%Y-%m-%d') 등록날짜 from comment where 등록작품id = ? order by id DESC`,[result[0]['id']],(err,results) => {
      console.log(result);
      if(req.session.passport != undefined) {
        res.render('ani', { title: 'express',comment:results,star:star ,data:result , list:['원제','원작','감독','각본','캐릭터 디자인','음악','제작사','장르','제작 국가','등급','총화수','공식 홈페이지'],login:req.session.passport.user});
      }
      else {
        res.render('ani', { title: 'express',comment:results,star:star,data:result , list:['원제','원작','감독','각본','캐릭터 디자인','음악','제작사','장르','제작 국가','등급','총화수','공식 홈페이지'],login:false});
      }
    })
  })
});

module.exports = router;
