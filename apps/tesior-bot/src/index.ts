import { Hono } from "hono";
import { App } from "@octokit/app";
import { verifyWebhookSignature } from "./verify";

const app = new Hono();

app.post("/", async (c: any) => {
  // wrangler secret put APP_ID
  const appId = c.env.APP_ID;
  const privateKey = c.env.PRIVATE_KEY;
  const secret = c.env.WEBHOOK_SECRET;
  // https://github.com/octokit/app.js/#readme
  const app = new App({
    appId,
    privateKey,
    webhooks: {
      secret,
    },
  });

  app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: "Hello there from Tesior Bot! 👋 Thanks for opening this issue 🚀",
      }
    );
  });

  const id = c.req.header("x-github-delivery");
  const name = c.req.header("x-github-event");
  const signature = c.req.header("x-hub-signature-256") ?? "";
  const payload = await c.req.json();
  const payloadString = JSON.stringify(payload);

  // Verify webhook signature
  try {
    await verifyWebhookSignature(payloadString, signature, secret);
  } catch (error: any) {
    console.log("error", error.message);
    return c.json(
      {
        message: error.message,
      },
      400
    );
  }

  try {
    await app.webhooks.receive({
      id,
      name,
      payload,
    });

    return c.json({
      message: "Hello from Tesior Bot!!",
    });
  } catch (error: any) {
    console.log("error", error.message);
    return c.json(
      {
        message: error.message,
      },
      500
    );
  }
});

export default app;
