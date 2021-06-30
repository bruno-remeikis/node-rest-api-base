import { Request, Response } from 'express';
import connection, { ErrorCodes } from '../database/mysql';
import bcrypt from 'bcrypt';

import { fields, isInRange } from '../models/User';

export default class UserController
{
    // INSERT
    async insert(req: Request, res: Response)
    {
        console.log('Insert user');

        const { name, email, pass, confPass } = req.body;

        // Validate
        if(!name || !email || !pass) {
            res.status(400).json({ code: "UNFILLED_FIELD" });
            return;
        }

        if(!isInRange(fields.name, name)
        || !isInRange(fields.email, email)
        || !isInRange(fields.pass, pass)) {
            res.status(400).json({ code: "INVALID_LENGTH" });
            return;
        }

        if(pass !== confPass) {
            res.status(400).json({ code: "DIFFERENT_PASSWORDS" });
            return;
        }
        
        // Generate password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        // Query
        const query = 
            `insert into tb_user
                (name, email, pass, salt)
            values ?`;

        const values = [
            [name, email, hash, salt]
        ];
    
        // Execute
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

    // SELECT
    async select(req: Request, res: Response)
    {
        console.log('Select users');

        const query = `
            select id, name, email, pass
            from tb_user`;

        // Execute
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

    // UPDATE
    async update(req: Request, res: Response)
    {
        console.log('Update user');

        const id = req.params.id;
        const { name, email, oldPass, newPass, confNewPass } = req.body;
        
        // Validate data
        if(!isInRange(fields.name, name)
        || !isInRange(fields.email, email)
        || ((oldPass || newPass || confNewPass)
        && (!isInRange(fields.pass, oldPass)
        ||  !isInRange(fields.pass, newPass)
        ||  !isInRange(fields.pass, newPass))))
        {
            res.status(400).json({ code: "INVALID_LENGTH" });
            return;
        }

        // Query
        var query = `
            update tb_user
            set name = ?, email = ?`;
        const values = [ name, email ];

        // If the password is being changed
        if(newPass)
        {
            // Validate passwords
            if(!oldPass || oldPass.length === 0
            || !confNewPass || confNewPass.length === 0) {
                res.status(400).json({ code: "UNFILLED_FIELD" });
                return;
            }

            if(!isInRange(fields.pass, newPass)) {
                res.status(400).json({ code: "INVALID_LENGTH" });
                return;
            }

            if(newPass !== confNewPass) {
                res.status(400).json({ code: "DIFFERENT_PASSWORDS" });
                return;
            }

            try {
                // Get current password (hash)
                const oldHash = await UserController.getPassById(id);

                // Compare passwords (database x request)
                if(!bcrypt.compareSync(oldPass, oldHash)) {
                    res.status(400).json({ code: "INVALID_PASSWORD" });
                    return;
                }
    
                // Generate new password
                const newSalt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash(newPass, newSalt);
    
                // Update query
                query += ", pass = ?, salt = ?";
                values.push(newHash, newSalt);
            }
            catch {
                res.status(400).json({ code: "ERROR" });
                return;
            }
        }

        // End query
        query += " where id = ?"
        values.push(id);

        // Execute
        connection.query(query, values, (err) =>
        {
            if(err) {
                console.error(err.message);
                res.status(400).json({ code: "ERROR" });
                return;
            }

            res.send();
        });
    }

    // DELETE
    async delete(req: Request, res: Response)
    {
        console.log('Delete user');

        const id = req.params.id;

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

    /**
     * Select pass (hash) by id
     * @param id user id
     * @returns JSON Promise containing 'pass' (hash) field
     */
    static async getPassById(id: number | string): Promise<string>
    {
        const query = `
            select pass
            from tb_user
            where id = ?`;

        // Treat asynchrony
        return new Promise<string>((resolve, reject) =>
        {
            // Execute
            connection.query(query, [id], (err, result: [{ pass: string }]): void =>
            {
                if(err) {
                    console.error(err.message);
                    reject(err);
                    return;
                }
                
                if(result.length > 0) {
                    resolve(result[0].pass);
                    return;
                }

                reject();
            });
        });
    }
}