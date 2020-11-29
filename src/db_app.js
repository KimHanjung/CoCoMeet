var redis = require('redis');
var JSON = require('JSON');

db_app.use(session({
    store : new RedisStore({
        client: redis, 
        host: 'localhost',
        port: 6379, 
        prefix: "session",
        db: 0,
        saveUninitialized: false,
        resave: false
    }),
    secret: {keyboard},
    cookie: {maxAge: 2592000000}
}));

db_app.get('/', function(req, res){
    // 세션값이 있으면
    if (req.session.key) {
        res.redirect('/admin');
    }
    else {
        //없으면 홈으로 이동
        res.render('index.html');
    }
});

db_app.post('/login', function(req, res) {
    //로그인 시 Key 값을 email로 session 저장
    req.session.key = req.body.email;
    res.end('done');
});

