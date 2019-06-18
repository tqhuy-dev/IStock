const {Pool} = require('pg');
const sha = require('sha256');
const authentication = require('../middle-ware/authentication');
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
        const checkAuthentication = await authentication.checkToken(req);
        if(checkAuthentication === false) {
            return res.status(203).json({
                status_code: 203,
                message: 'Not Authentication'
            })
        } else {
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
    },

    async loginUser(req , res) {
        const queryText = 'select login_user($1 , $2 , $3 , $4)';
        const token = sha(req.body + new Date());
        const params = [
            req.body.email,
            req.body.password,
            new Date().getTime().toString(),
            token
        ];

        try {
            const { rows } = await pool.query(queryText , params);
            return res.status(200).json({
                status_code: 200,
                message: rows[0].login_user,
                token: token
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