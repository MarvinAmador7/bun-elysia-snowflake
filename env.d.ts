declare module "bun" {
  interface Env {
    SNOWFLAKE_ACCOUNT: string;
    SNOWFLAKE_USERNAME: string;
    SNOWFLAKE_PASSWORD: string;
    SNOWFLAKE_DATABASE: string;
    SNOWFLAKE_SCHEMA: string;
    SNOWFLAKE_WAREHOUSE: string;
  }
}
