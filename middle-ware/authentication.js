const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.connectpg
});

pool.on('connect', () => {
    console.log('connected db');
})

const authentication = {
    async checkToken(req , res) {
        const {rows} = await pool.query('select count(*) from account where account.token = $1' ,
        [req.headers.authorization]);
        const data = rows[0].count;
        if(data === '0') {//not authentication
            return res.status(203).json({
                status_code: 203,
                message: 'Not Authentication'
            })
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = authentication;
