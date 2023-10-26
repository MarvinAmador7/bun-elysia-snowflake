import * as sf from "snowflake-sdk";
import type { Options as PoolConfig, Pool } from "generic-pool";
import { Elysia } from "elysia";

export function snowflake(
  config: sf.ConnectionOptions,
  poolConfig?: PoolConfig
) {
  console.log("config", config);
  const pool = sf.createPool(config, poolConfig);

  function executeSql<TResponse>(
    sql: string,
    variables?: sf.Binds
  ): Promise<TResponse> {
    return pool.use(async (clientConnection) => {
      return new Promise((resolve, reject) => {
        clientConnection.execute({
          sqlText: sql,
          binds: variables,
          complete: function (err, stmt, rows) {
            if (err) {
              console.error(
                "Failed to execute statement due to the following error: " +
                  err.message
              );

              reject(err);
            } else {
              console.log(
                "Successfully executed statement: " + stmt.getSqlText()
              );
              resolve(rows as TResponse);
            }
          },
        });
      });
    });
  }

  return new Elysia({ name: "snowflake" })
    .decorate("snowflake", { executeSql })
    .on("stop", () => pool.drain());
}

function closeConnection(
  connection: sf.Connection,
  config?: sf.ConnectionOptions
) {
  if (config && !config.clientSessionKeepAlive) return;

  connection.destroy((err) => {
    if (err) {
      console.error("Unable to disconnect: " + err.message);
    } else {
      console.log("Disconnected connection with id: " + connection.getId());
    }
  });
}

async function releaseConnection(
  pool: Pool<sf.Connection>,
  connection: sf.Connection
) {
  await pool.release(connection);
  if (process.env.NODE_ENV === "development")
    console.log("Released connection with id: " + connection.getId());
}
