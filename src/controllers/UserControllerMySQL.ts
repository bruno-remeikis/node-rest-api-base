import { Request, Response } from 'express';
import connection, { ErrorCodes } from '../database/mysql';

export default class UserController
{
    async select(req: Request, res: Response)
    {
        console.log('Selecting users');

        const query = `
            select id, name, email, pass
            from tb_user`;

        connection.query(query, [], (err, result) =>
        {
            if(err) {
                console.error(err.message);
                res.status(400).json({ msg: "Erro ao carregar usuário" });
                return;
            }

            res.json(result);
        });
    }

    async insert(req: Request, res: Response)
    {
        console.log('Inserting user');

        const { name, email, pass, confPass } = req.body;

        if(pass !== confPass)
            res.status(400).json({ msg: "Senhas diferentes" });

        const query = 
            `insert into tb_user
                (name, email, pass)
            values ?`;

        const values = [
            [name, email, pass]
        ];

        connection.query(query, [values], (err, result) =>
        {
            if(err) {
                console.error(err.message);

                if(err.code === ErrorCodes.DUPLICATE_ENTRY)
                    res.status(400).json({ code: "DUPLICATE_ENTRY", msg: "Email já cadastrado" });
                else
                    res.status(400).json({ code: "ERROR", msg: "Erro ao cadastrar usuário" });
                return;
            }

            res.json({
                id: result.insertId
            });
        });
    }
}