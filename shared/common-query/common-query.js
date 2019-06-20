const { Pool } = require('pg');
const ResponseObject = require('../model/response-object');
const pool = new Pool({
    connectionString: process.env.connectpg
})
pool.on('connect', () => {
    console.log('connected db');
})

const commonQuery = {
    async getEmailFromToken(req , res) {
        try {
            const {rows} = await pool.query('select account.email from account where account.token = $1' ,[
                req.headers.authorization
            ]);

            return rows[0].email;
        } catch (error) {
            return res.status(500).json(new ResponseObject(500 , error));
        }
    },

    //this will check email from token with email from id stock
    async checkPermissonEmail(req , res) {
        try {
            const emailUser = await this.getEmailFromToken(req , res);
            const {rows} = await pool.query('select stock.email from stock where stock.id = $1' , [
                req.params.id
            ]);
            if(emailUser === rows[0].email) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return res.status(500).json(new ResponseObject(500 , error));
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = commonQuery;