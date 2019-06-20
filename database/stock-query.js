const { Pool } = require('pg');
const authentication = require('../middle-ware/authentication');
const sha = require('sha256');
const pool = new Pool({
    connectionString: process.env.connectpg
})
pool.on('connect', () => {
    console.log('connected db');
})

const stockQuery = {
    async createStock(req , res) {
        await authentication.checkToken(req , res);
        const queryText = 'select create_stock($1,$2,$3,$4,$5)';
        const params = [
            req.headers.authorization,
            req.body.name,
            new Date().getTime().toString(),
            sha(req.body + new Date()),
            req.body.description
        ];

        try {
            const {rows} = await pool.query(queryText , params);
            return res.status(200).json({
                data: rows[0].create_stock
            })
        } catch (error) {
            return res.status(400).json({
                error: error
            })            
        }
    },

    async getStock(req , res) {
        await authentication.checkToken(req , res);
        try {
            //get email from  token 
            const {rows} = await pool.query('select account.email from account where account.token = $1' ,
            [req.headers.authorization]);
            //get list stock of user by email
            const queryText = 'select * from stock where stock.email = $1';
            const params = [
                rows[0].email
            ];

            const data = await pool.query(queryText , params);
            return res.status(200).json({
                status_code: 200,
                message: 'query success',
                data: data.rows
            })
        } catch (error) {
            return res.status(400).json({
                status_code: 400 , 
                message: error,
            })
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = stockQuery;
