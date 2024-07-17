import { Hono } from "hono";
import { PrismaClientWithoutExtension, withAccelerate } from "@repo/prisma";

const app = new Hono();

app.post("/", async (c: any) => {
  if (
    !c.req.header("Authorization") ||
    c.req.header("Authorization") !== c.env.AUTH_TOKEN
  ) {
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );
  }

  const body = await c.req.json();

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
