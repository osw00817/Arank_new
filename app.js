const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'arank'
})
conn.connect();

const passport = require('passport'),KakaoStrategy = require('passport-kakao').Strategy;
const session = require('express-session');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const aniRouter = require('./routes/ani');
const searchRouter = require('./routes/search');
const recommendRouter = require('./routes/recommend');
const quarterRouter = require('./routes/quarter');

const app = express();

/*
네이티브 앱 키
658d375a3a3eaf721f5b0965f6a9de0e
REST API 키
07b99dea3a0499344ed5dbf91812b0a9
JavaScript 키
0122753806a6bc6c52e9c63be70ca1f4
Admin 키
90bdbf0ba732f668798a371204d285e5
*/


app.use(session({
  secret:'Arank',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

const KakaoKey = {
  clientID: '07b99dea3a0499344ed5dbf91812b0a9',
  clientSecret: '',
  callbackURL: 'http://localhost:3000/login/kakao'
};

passport.use(new KakaoStrategy(KakaoKey, function(accessToken,refreshToken,profile,done) {
  console.log(profile.id);
  const NewUser_id = profile.id;
  const NewUser_passwrod = crypto.createHash('sha512').update(profile.id.toString()).digest('hex');;
  const NewUser_nickname = profile.username;
  const sql = "select * from ka_login where id = ?";
  conn.query(sql,[NewUser_id],(err,results) => {
    if(err) { 
      console.log(err) 
      done(err);
    }
    if(results.length == 0) 
    {
            const sql = "insert ka_login(id,username,password) values(?,?,?)";
            const post = [NewUser_id,NewUser_nickname,NewUser_passwrod];
            conn.query(sql,post,(err,results) => {
              if(err) { 
                console.log(err) 
                done(err);
              }
              const sql = "select * from ka_login where id=?";
              const post = [NewUser_id];
              conn.query(sql,post,(err,results) => {
                if(err) {
                  console.log(err);
                  done(err);
                }
                done(null,results[0]);
              });
            });
    }
    else {
      done(null,results[0]);
    }
  });
}))
passport.serializeUser(function(user,done) {
  console.log("로그인 성공")
  done(null,user);
});
passport.deserializeUser(function(user,done) {
  console.log("로그인 확인")
  done(null,user);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/search', searchRouter);
app.use('/ani/:name', aniRouter);

app.use('/login', loginRouter);
app.use('/login/kakao',passport.authenticate('kakao',{
  failureRedirect: '/login',
  successRedirect:'/'
}))

app.get('/comment',(req,res) => {
  res.render('test');
})

app.post('/comment/register',(req,res) => {
  console.log(req.body.id);
  console.log(req.body.userID);
  console.log(req.body.star);
  console.log(req.body.comment);
  conn.query('select * from comment where 등록작품id =? AND 등록자id =?',[req.body.id,req.body.userID],(err,result) => {
    if(err) console.log(err);
    console.log(result);
    if(result.length > 0) {
      console.log(false);
      res.send("false");
    }
    else {
      conn.query(`UPDATE ani_info SET 추천 = 추천+${req.body.star} , 추천수 = 추천수+1 WHERE (id = ?);`,[req.body.id],(err,result) => {
        conn.query(`INSERT comment (등록작품id,등록자닉네임,등록자id, 평점, 평론, 등록날짜) VALUES (?,?,?,?,?,now());`
        ,[req.body.id,req.body.username,req.body.userID,req.body.star,req.body.comment],(err,result) => {
          if(err) console.log(err) 
          console.log(result);
            conn.query('select * from comment where 등록작품id =? order by id DESC',[req.body.id],(err,result) => {
              if(err) console.log(err) 
               console.log(result);
              res.json(result);
            });
        })
      })
    }
  })
})

app.use('/recommend',recommendRouter);

app.use('/quarter/:rank',(req,res) => {
  const 년도 = req.params.rank.split('.')[0];
  const 분기 = req.params.rank.split('.')[1];
  console.log(년도 + 분기);
  conn.query('select * from ani_info  where 출시년도=? and `출시 분기` = ? order by 추천 DESC LIMIT 10;',[년도,분기],(err,result) =>{
    let link = [];
    for(let i = 0;i<result.length;i++) {
      link.push("/ani/"+encodeURI(result[i]['제목']));
    }
    if(req.session.passport != undefined) {
      console.log(req.session.passport);
      res.render('index', { title: `${년도}년 ${분기}분기 애니메이션 TOP10`,sub_title:`Arank에서 선정된 ${년도}년 ${분기}분기 애니메이션 탑10`,link:link ,data:result,login:req.session.passport.user});
    }
    else {
      res.render('index', { title: `${년도}년 ${분기}분기 애니메이션 TOP10`,sub_title:`Arank에서 선정된 ${년도}년 ${분기}분기 애니메이션 탑10` ,link:link ,data:result,login:false});
    }
  })
});
app.use('/quarter',quarterRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
