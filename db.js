const { Pool } = require('pg');

//Configuracion de los datos de nuestra conexion local

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ExpressJS_Practice',
    password: '2004',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};





