import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();
  console.log("Data received by webhook", JSON.stringify(body, null, 2));
  console.log("Authorization Header - ", c.req.header("Authorization"));
  console.log("Headers -", c.req.header());
  console.log("Query Params -", c.req.query("param"));

  return c.json({
    message: "Hello Hono!",
  });
});

export default app;
