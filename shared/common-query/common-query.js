const { Pool } = require('pg');
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
            return res.status(500).json({
                status_code : 500,
                message: error
            })
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = commonQuery;