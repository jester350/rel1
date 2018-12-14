const pool = require('../db');

const date = require('date-and-time');

var offset = 0;
var count = 10;

console.log('cert controller');

module.exports.certsGetAll = function (request, response, next) {
    console.log('running cert all query');
    
    
async function getNumber() { // Function statment
    return 42;
  }
  let logNumber = function() { // Function expression
    console.log(getNumber());
  }
  logNumber(); // 42

    pool.query('SELECT cert.row_id as rowid, cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,systems.name as systemName, cert.start_date+99 as testdata \
    FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert \
    inner join systems on systems.row_id = cert_system_junc.system ORDER BY certExpiryDate ASC', (err, res) => {
            console.log(res.rows);

            if (err) return next(err);

            if (request.query && request.query.offset) {
                offset = parseInt(request.query.offset, 10);
            }

            if (request.query && request.query.count) {
                count = parseInt(request.query.count, 10);
            }
            var today = new Date();
            for (var i in res.rows) {

                var daysLeft=date.subtract(res.rows[i].certexpirydate,today).toDays();
                res.rows[i].daysleft = daysLeft;

                sdate=date.format(res.rows[i].certstartdate,'DD-MM-YYYY');
                res.rows[i].certstartdate = sdate;

                edate=date.format(res.rows[i].certexpirydate,'DD-MM-YYYY');
                res.rows[i].certexpirydate = edate;
            }

            res.rows[0].testrec = "test";
            console.log('render test');
            
            response
                .render('list_certs', { data: res.rows, title: 'Test' });
        }
        );
        console.log("query done");
};

module.exports.certsGetOne = function (request, response, next) {
    console.log("running get single cert...");
    const id = request.params.certId;

    pool.query('SELECT cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,systems.name as systemname \
        FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert \
        inner join systems on systems.row_id = cert_system_junc.system WHERE cert.row_id = $1', [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            var today = new Date();
            var sysname=res.rows[0].systemName;
            var sdate=date.format(res.rows[0].certstartdate,'YYYY-MM-DD');
            var edate=date.format(res.rows[0].certexpirydate,'YYYY-MM-DD');
            var daysLeft=date.subtract(res.rows[0].certexpirydate,today).toDays();
            var sysname=res.rows[0].systemname;
            response
                .render('getCert', { data: res.rows, title: 'Test get one',sdate: sdate,edate: edate,sysname: sysname,dleft: daysLeft});
        });
};

module.exports.certsGetOne = function (request, response, next) {
    console.log("running get single cert...");
    const id = request.params.certId;

    pool.query('SELECT cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,systems.name as systemname \
        FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert \
        inner join systems on systems.row_id = cert_system_junc.system WHERE cert.row_id = $1', [id], (err, res) => {
            // pool.query('SELECT * FROM cert where row_id = $1', [id], (err, res) => {
            if (err) return next(err);
            var today = new Date();
            var sysname=res.rows[0].systemName;
            var sdate=date.format(res.rows[0].certstartdate,'YYYY-MM-DD');
            var edate=date.format(res.rows[0].certexpirydate,'YYYY-MM-DD');
            var daysLeft=date.subtract(res.rows[0].certexpirydate,today).toDays();
            var sysname=res.rows[0].systemname;
            response
                .render('getCert', { data: res.rows, title: 'Test get one',sdate: sdate,edate: edate,sysname: sysname,dleft: daysLeft});
        });
};

module.exports.certAddOne = function (request, response, next) {
    console.log("POST new cert");
    pool.query('SELECT row_id as id, name as systemname from systems', (err,res) => {
        if (err) return next(err);
        console.log(res.rows);
    response
        .render('addCert',{data: res.rows, title: 'Add Cert'});        
    })


     var today = new Date();
     const { name, created_date, created_by, expiry_date, start_date, system } = request.body;

     pool.query(
         'INSERT INTO cert(name, created_date, created_by, expiry_date,start_date) VALUES($1, $2, $3, $4, $5)',
        [name, today, created_by, expiry_date, start_date],
        (err, res) => {
            if (err) return next(err);

            response.redirect('/certs');
        }
    );
};
