import oracledb, { Connection } from 'oracledb';
import "dotenv/config";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const NAME = process.env.DB_NAME;
const connectString =
    `(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = ${HOST})(PORT = ${PORT}))(CONNECT_DATA = (SERVICE_NAME = ${NAME})))`;

const connection = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: connectString,
};

export function close(con: Connection) {
    con.release((err) => {
        if(err)
            console.error(err.message);
    });
}

export default connection;