const pool = require('../db');
var path = require('path');
const date = require('date-and-time');
const appUsers = require('../constructors/users');
var User = require('../models/user');
fs = require('fs');

var offset = 0;
var count = 10;
var pagerStart=0;

module.exports.admin2 = function (request, response, next) {
    console.log("user admin...");
    const id = request.params.certId;
    kev = (path.join(__dirname, '/public'));
    console.log("kev dir "+response.public);
    path.resolve(__dirname, '.../public');
    response.sendFile('/public/pages/signup.html', {root: 'F:/node_proj/cert-main/certsprebluebird/'});
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.admin = function (request, response, next) {
    console.log("user admin...");
    const id = request.params.certId;
    User.findAll().then(function(users) {
        response.render('test', {
          title: 'User Admin',
          users: users
        });
      });
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.add = function (request, response, next) {
    console.log("user add...");
    const id = request.params.certId;
    kev = (path.join(__dirname, '/public'));
    //console.log("kev dir "+response.public);
    path.resolve(__dirname, '.../public');
    // response.sendFile('/public/pages/adduser.html', {root: appRoot});
    response
        .render('addUser', { data: response.rows, title: 'Add user' });
    //response
    //            .render('test', { title: ': Admin'});
};

module.exports.postUser = function (request, response, next) {
    console.log("post user : "+request);
    const id = request.params.certId;
    User.create({ username: request.body.username,email: request.body.email,password: request.body.password,accessLvl: request.body.accessLvl }).then(function() {
        response.redirect('/');
      });
};