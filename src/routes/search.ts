import { Elysia } from "elysia";
import { snowflake as snowflakePlugin } from "~/plugins/snowflake";

export const search = new Elysia({ prefix: "/search" })
  .use(
    snowflakePlugin({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USERNAME,
      password: process.env.SNOWFLAKE_PASSWORD,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
    })
  )
  .get("/", async ({ query, snowflake }) => {
    if (!query.sql) throw new Error("Missing query parameter: sql");

    const res = await snowflake.executeSql(query.sql);
    return res;
  });
