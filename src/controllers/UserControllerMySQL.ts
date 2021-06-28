import { Request, Response } from 'express';
import connection, { ErrorCodes } from '../database/mysql';

export default class UserController
{
    async select(req: Request, res: Response)
    {
        console.log('Select users');

        const query = `
            select id, name, email, pass
            from tb_user`;

        connection.query(query, [], (err, result) =>
        {
            if(err) {
                console.error(err.message);
                res.status(400).json({ code: "ERROR" });
                return;
            }

            res.json(result);
        });
    }

    async insert(req: Request, res: Response)
    {
        console.log('Insert user');

        const { name, email, pass, confPass } = req.body;

        if(!name || !email || !pass) {
            res.status(400).json({ code: "UNFILLED_FIELD" });
            return;
        }

        if(name .length < 3 || name .length > 40
        || email.length < 5 || email.length > 80
        || pass .length < 5 || pass .length > 32) {
            res.status(400).json({ code: "INVALID_LENGTH" });
            return;
        }

        if(pass !== confPass) {
            res.status(400).json({ code: "DIFFERENT_PASSWORDS" });
            return;
        }

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
                    res.status(400).json({ code: "DUPLICATE_ENTRY" });
                else
                    res.status(400).json({ code: "ERROR" });
                return;
            }

            res.json({
                id: result.insertId
            });
        });
    }

    async delete(req: Request, res: Response)
    {
        console.log('Delete user');

        const id = req.params.id;

        console.log(id);

        const query = `
            delete from tb_user
            where id = ?`;

        connection.query(query, [id], (err) =>
        {
            if(err) {
                console.error(err.message);
                res.status(400).json({ code: "ERROR" });
                return;
            }

            res.send();
        });
    }
}