var express = require('express');
var router = express.Router();

const pool = require('../db');

var offset = 0;
var count = 10;

console.log("test page");
/* GET home page. */



router.get('/', (request, response, next) => {
    console.log('running test query');
    pool.query('SELECT cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,systems.name as systemName FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert inner join systems on systems.row_id = cert_system_junc.system ORDER BY cert.row_id ASC', (err, res) => {
//    pool.query('SELECT cert.name as certname FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert inner join systems on systems.row_id = cert_system_junc.system ORDER BY cert.row_id ASC', (err, res) => {
console.log(res.rows);
        if (err) return next(err);
        if (request.query && request.query.offset) {
            offset = parseInt(request.query.offset,10);
        }

        if (request.query && request.query.count) {
            count = parseInt(request.query.count,10);
        }

        console.log('render test');

        response
            .render('test', {data: res.rows, title: 'Test' });
    });
});



module.exports = router;
