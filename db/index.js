const { Pool } = require('pg');

const{user, host, database, userdatabase, password, port} = require('../secrets/db_configuration');

const pool = new Pool({ user, host, database,userdatabase, password, port});

module.exports = pool;