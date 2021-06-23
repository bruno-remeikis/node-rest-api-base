import { Request, Response } from 'express';
import oracledb from 'oracledb';
import connection, { close } from '../database/oracle';

export default class UserController
{
    async select(req: Request, res: Response)
    {
        const query = `
            select id, email, pass
            from tb_user`;

        // CONEXÃO E EXECUÇÃO
        oracledb.getConnection(connection, (err, connection) =>
        {
            if(err) {
                console.error(err.message);
                res.status(400).json({msg: 'Falha na conexão.'});
                return;
            }

            // Buscar resultados
            connection.execute(query, [], (err, result) => {
                if(err) {
                    console.error(err.message);
                    close(connection);
                    res.status(400).json({msg: 'Falha na execução.'});
                    return;
                }

                res.json(result.rows);

                close(connection);
            });
        });
    }

    async insert(req: Request, res: Response)
    {

    }

    /*
    async create(req: Request, res: Response)
    {
        const { email, pass, confPass } = req.body;

        if(pass !== confPass)
            res.status(400).json({ msg: "Senhas diferentes" });

        const query = 
            `insert into tb_user
                (usr_email, usr_pass)
            values ?`;

        const values = [
            [email, pass]
        ];

        connection.query(query, [values], (err: Error, result: any) =>
        {
            if(err) {
                res.status(400).json({ msg: "Erro ao cadastrar usuário" });
                return;
            }

            res.json({
                id: result.insertId
            });
        });
    }
    */
}