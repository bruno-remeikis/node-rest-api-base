import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import routes from './routes';

// Config and verify .env
dotenv.config();

if(!process.env.PORT)
    process.exit(1);

const port: number = parseInt(process.env.PORT as string, 10);

// Config app
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});