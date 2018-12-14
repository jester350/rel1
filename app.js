var express = require('express');

var path = require('path');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var date = require('date-and-time');
var date = require('debug');
var async = require('async');
var User = require('./models/user');
var AccessLvl = require('./models/accesslevels');
var schedule = require('node-schedule');
var cron = require('./bin/cron');
var fs = require('fs');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var certsRouter = require('./routes/certs');
var testRouter = require('./routes/test');




var offset_def = 10;

var routes = require('./routes')

var app = express();
app.use(fileUpload());
var path = require('path');
global.appDir = path.dirname(require.main.filename);
global.appRoot = path.resolve(__dirname);
console.log("root "+appRoot);

//var j = schedule.scheduleJob('30 30 1 * * *', function(){
//    console.log('The answer to life, the universe, and everything!');
//  });


var mailFromGod = schedule.scheduleJob('30 * * * * *', cron.godmail); // MAIL CRON LINE

// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
//app.use('/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui/external/jquery-1.12.1/'));

// view engine setup
app.set('public', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    // name: 'certdb@bpdts.com',
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expires: 6
        name: "certDB",
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    // console.log(res.cookie(cookie_name , 'cookie_value').send('Cookie is set'));
    console.log("check user : "+req.cookies.user_sid);
    if (req.session.user && req.cookies.user_sid) {
        console.log("route 1");
        res.redirect('/certs');
    } else {
        console.log("route 2");
        next();
    }  
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// app.use('/', indexRouter);

app.route('/sigxnup')
    .get(sessionChecker, (req, res) => {
        console.log("sign up");
        res.sendFile(__dirname + '/public/pages/3signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            accessLvl: req.body.accessLvl
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/login');
        })
        .catch(error => {
            res.redirect('/4signup');
        });
    });

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/pages/login.html');
    })
    .post((req, res) => {
            username = req.body.username,
            password = req.body.password
            accessLvl = 0;
        console.log("find user");

        //User.findOne({ where: { username: username } }).then(user => {
        //    console.log("test findone");
        //    console.log(user.get('username'));
        //  });

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                console.log("user not found");
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                console.log("invalid password");
                res.redirect('/login');
            } else {
                kevuser => {
                    console.log("test findone 2");
                    console.log(user.get('username'));
                  }
                accessLvl = user.get('accessLvl');
                console.log("log in user..."+user.get('username')+" : "+user.get('accessLvl'));
                req.session.user = user.dataValues;
                console.log("render cert screen");
                res.redirect('/certs');
            }
        })
    });

//app.get('/', (req, res) => {
//    if (req.session.user && req.cookies.user_sid) {
//        res.sendFile(__dirname + '/certs');
//    } else {
//        res.redirect('/login');
//    }
//});

// app.use('/users', usersRouter);

app.get('/certs/', (req, res,next) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log("do a cert thing");
        app.use('/certs',certsRouter);
        next();
    } else {
        console.log("dont do a cert thing");
        res.redirect('/login');
    }
});

app.get('/admin', (req, res,next) => {
    console.log("admin");
    if (req.session.user && req.cookies.user_sid) {
        if (accessLvl == 1) {
            // res.sendFile(__dirname + '/public/pages/signup.html');
            app.use('/admin',usersRouter);
        next();
    } else {
        res.redirect('/login');
    }}
});
// route for user logout
app.get('/logout', (req, res) => {
    res.seesioncookie = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("cookie name : "+req.session.cookie.name)
    console.log("logging out");
    res.clearCookie('user_sid'); 
    res.clearCookie(req.session.cookie.name,{ path: '/'});
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy(function(err) {
            // cannot access session here
          })
        console.log("exit 1");
        res.clearCookie(req.cookies.user_sid);
        console.log("expire cookie");
        res.seesioncookie = "used_sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("clear cookie");
        // res.clearCookie(req.cookie);
        
        res.redirect('/');
    } else {
        console.log("exit 2");
        res.clearCookie(req.cookies.user_sid);
        res.clearCookie(req.session.cookie.name,{ path: '/'});
        res.redirect('/login');
    }
});

// app.use('/certs',certsRouter);
// app.use('/test',testRouter);

module.exports = app;
