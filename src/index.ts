import { Elysia } from "elysia";
import { search } from "~/routes/search";

const app = new Elysia()
  .group("/v1", (app) => app.get("/", () => "Using v1").use(search))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
