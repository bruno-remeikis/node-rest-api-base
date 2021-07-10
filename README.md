## Init 

1. Initialize project
```npm init -y```

2. Install projects dependencies
```yarn add express cors dotenv ts-node-dev```

3. Add TypeScript to the projects
```yarn add -D typescript @types/node @types/express @types/cors @types/dotenv```

4. add the following line to the `scripts` of `package.json` file:
```"start": "tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts"```

5. Generate `tsconfig.json`
```npx tsc --init```

6. Create the `.env` file

7. Create the `server.ts` and `routes.ts` files in `src` directory

8. Create the `controllers` and `database` folders in `src`

## Database dependencies

1. Oracle
```yarn add oracledb @types/oracledb```

2. MySQL
```yarn add mysql @types/mysql```

## .env EXAMPLE

``` env
PORT=3333

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASS=
DB_NAME=db_node_rest_api_base
```
