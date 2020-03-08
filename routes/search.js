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
router.get('/search', function(req, res, next) {
  conn.query(`SELECT distinct 제목,img,감독 FROM arank.ani_info where 제목 like "%${req.query.query}%";`,(err,result) =>{
      console.log(result);
      let link = [];
      for(let i = 0;i<result.length;i++) {
        link.push("/ani/"+encodeURI(result[i]['제목']));
      }
    if(req.session.passport != undefined) {
      console.log(req.session.passport);
      res.render('search', { title: req.query.query ,link:link, data:result ,login:req.session.passport.user});
    }
    else {
      res.render('search', { title: req.query.query ,link:link,data:result ,login:false});
    }
  })
});

module.exports = router;
