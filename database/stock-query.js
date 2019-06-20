const { Pool } = require('pg');
const authentication = require('../middle-ware/authentication');
const sha = require('sha256');
const commonQuery = require('../shared/common-query/common-query');
const { STOCK_STATUS } = require('../shared/constant/constant');
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
    },

    async editStock(req , res) {
        await authentication.checkToken(req , res);
        try {
            const {rows} = await pool.query('select count(*) from stock where stock.id = $1' , [req.params.id]);
            if(rows[0].count > 0) {
                const queryText = 'UPDATE stock '+ 'SET description= $1, name=$2 ' + 'WHERE stock.id = $3';
                const params = [
                    req.body.name,
                    req.body.description,
                    req.params.id
                ];
                await pool.query(queryText , params);
                return res.status(200).json({
                    status_code: 200 , 
                    message: 'update stock success'
                })
            } else {
                return res.status(203).json({
                    status_code: 203 , 
                    message : 'stock not fount'
                })
            }

        } catch (error) {
            return res.status(500).json({
                status_code: 500,
                message: error
            })
        }
    },

    async deleteStock(req , res) {
        await authentication.checkToken(req , res);
        try {
            const dataCheckStock = await pool.query('select count(*) from stock where stock.id = $1' , [
                req.params.id
            ]);
            if(parseInt(dataCheckStock.rows[0].count) > 0) {
                const emailUser = await commonQuery.getEmailFromToken(req , res);
                const checkStockUser = await pool.query('select stock.email from stock where stock.id = $1' ,[
                    req.params.id
                ]);
                
                if(emailUser === checkStockUser.rows[0].email) {
                    const queryText = 'UPDATE stock SET status=$2 WHERE stock.id = $1';
                    const params = [req.params.id, STOCK_STATUS.DELETE];
                    await pool.query(queryText , params);
                    return res.status(200).json({
                        status_code:200 , 
                        message: 'delete success'
                    })
                } else {
                    return res.status(203).json({
                        status_code: 203,
                        message: 'you dont have permission'
                    })
                }
                
            } else {
                return res.status(203).json({
                    status_code: 203,
                    message: 'stock item not found'
                })
            }
        } catch (error) {
            return res.status(500).json({
                status_code: 500,
                message: error
            })
        }
    }
}

pool.on('remove', () => {
    console.log('client remove');
});

module.exports = stockQuery;
