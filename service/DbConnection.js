const mysql = require('mysql');
const {dbConfig} = require('../config/MainConfig');

class Connection {
    constructor() {
        console.log("constructor db")
        this.pool = mysql.createPool({
            connectionLimit     : 0,
            host                : dbConfig.host,
            port                : dbConfig.port,
            user                : dbConfig.user,
            database            : dbConfig.database,
            password            : dbConfig.password,
            queueLimit          : 0,
            multipleStatements  : true
        });
    }
    SqlQuery(strQuery, paramQuery)
    {
        return new Promise ((resolve, reject)=> {
            this.pool.getConnection((err, conn)=> {
                err ? reject(err) : ''
                conn.query(strQuery, paramQuery, (err, res)=> {
                    if (err){
                        err ? reject(err) : ''
                        conn.release()
                    }
                    else {
                        resolve(res[0])
                        conn.release()
                    }
                });
            })
        })
    }
}

module.exports = new Connection();

