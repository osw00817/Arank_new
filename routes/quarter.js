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

router.get('/', function(req, res, next) {
    if(req.session.passport != undefined) {
      console.log(req.session.passport);
      res.render('rank', { title: 'express' ,login:req.session.passport.user});
    }
    else {
      res.render('rank', { title: 'express',login:false});
    }
});

module.exports = router;
