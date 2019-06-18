const {Pool} = require('pg');
const sha = require('sha256');
const pool = new Pool({
    connectionString: process.env.connectpg
});

pool.on('connect', () => {
    console.log('connected db');
})

const userQuery = {

    async createUser(req , res) {
        const idUser = sha(req.body + new Date);
        const queryText = 'select create_account($1,$2,$3,$4,$5,$6,$7,$8,$9)';
        const params = [
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            req.body.role,
            new Date().getTime().toString(),
            sha(req.body + new Date()),
            req.body.address,
            req.body.phone,
            req.body.password
        ];
        try {
            const { rows } = await pool.query(queryText , params);
            return res.status(200).json({
                status_code: 200 ,
                message: rows[0].create_account
            })
        } catch (error) {
            return res.status(400).json({
                error: error
            });           
        }
    },

    async selectUser(req , res) {
        const queryText = 'select * from user_table where email = $1';
        const params = [
            req.query.email
        ]
        try {
            const { rows , rowCount } = await pool.query(queryText , params);
            return res.status(200).json({
                data: rows,
                count: rowCount
            });
        } catch (error) {
            return res.status(400).json({
                error: error
            });            
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = userQuery;