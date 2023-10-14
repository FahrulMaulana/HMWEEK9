const Pool = require('pg').Pool
const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'movie-database',
    password : 'buruken12',
    port : 5432 ,
});

module.exports = pool