import { Hono } from "hono";
import { PrismaClientWithoutExtension, withAccelerate } from "@repo/prisma";

const app = new Hono();

app.post("/", async (c: any) => {
  const body = await c.req.json();
  console.log("Data received by webhook", JSON.stringify(body, null, 2));
  console.log("Authorization Header - ", c.req.header("Authorization"));
  console.log("Headers -", c.req.header());
  console.log("Query Params -", c.req.query("param"));

  const prisma = new PrismaClientWithoutExtension({
    datasources: {
      db: {
        url: c.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  await prisma.indexer.create({
    data: {
      transaction: body,
    },
  });

  return c.json({
    message: "Blockchain transaction indexed successfully",
  });
});

export default app;
