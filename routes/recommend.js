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
  conn.query('select * from ani_info order by RAND() LIMIT 5;',(err,result) =>{
    let link = [];
    for(let i = 0;i<result.length;i++) {
      link.push("/ani/"+encodeURI(result[i]['제목']));
    }
    if(req.session.passport != undefined) {
      console.log(req.session.passport);
      res.render('recommend', { title: 'express' ,link:link ,data:result,login:req.session.passport.user});
    }
    else {
      res.render('recommend', { title: 'express' ,link:link ,data:result,login:false});
    }
  })
});

module.exports = router;
