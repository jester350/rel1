function readdb () {
    console.log("in select db func");
    return new Promise (function (resolve, reject){pool.query('SELECT cert.row_id as rowid, cert.name as certname,cert.start_date as certStartDate,cert.expiry_date as certExpiryDate,systems.name as systemName, cert.start_date+99 as testdata \
    FROM cert INNER JOIN cert_system_junc ON cert.row_id = cert_system_junc.cert \
    inner join systems on systems.row_id = cert_system_junc.system ORDER BY certExpiryDate ASC', (err, res) => {
            console.log(res.rows);
            kev = 2;
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
            console.log('render test after promise');
         
            response
                .render('list_certs', { data: res.rows, title: 'Test' });

            return res.rows;
        }
        )})};