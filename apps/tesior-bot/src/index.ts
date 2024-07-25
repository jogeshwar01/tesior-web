import { Hono } from "hono";
import { App } from "@octokit/app";
import { verifyWebhookSignature } from "./verify";
import { convertIssueData } from "./utils";
import { PrismaClientWithoutExtension, withAccelerate } from "@repo/prisma";

const app = new Hono();

app.post("/", async (c: any) => {
  // wrangler secret put APP_ID
  const appId = c.env.APP_ID;
  const privateKey = c.env.PRIVATE_KEY;
  const secret = c.env.WEBHOOK_SECRET;
  const botUsername = c.env.BOT_USERNAME;

  // https://github.com/octokit/app.js/#readme
  const app = new App({
    appId,
    privateKey,
    webhooks: {
      secret,
    },
  });

  const storePayloadInDb = async (payload: object) => {
    const simplifiedIssueData = convertIssueData(payload);

    const prisma = new PrismaClientWithoutExtension({
      datasources: {
        db: {
          url: c.env.DATABASE_URL,
        },
      },
    }).$extends(withAccelerate());

    await prisma.githubBot.create({
      data: {
        payload: simplifiedIssueData,
      },
    });
  };

  app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: `Hello there from Tesior Bot! 👋 Thanks for opening this issue. ✨
        The team is on it and will get back to you soon. 🛠️`,
      }
    );
  });

  app.webhooks.on("pull_request.opened", async ({ octokit, payload }) => {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: `Hello there from Tesior Bot! 👋 Thanks for opening this PR. 🚀 
        This will be reviewed by the team soon. 🕵️‍♂️`,
      }
    );
  });

  app.webhooks.on("issue_comment.created", async ({ octokit, payload }) => {
    // check before storing if the comment is a bounty request
    // if comment not made by bot, store in db
    if (payload?.comment?.user?.login !== botUsername) {
      await storePayloadInDb(payload);
    }

    // if comment is a bounty request and made by the owner of the repo
    if (
      payload?.comment?.body?.includes("/bounty") &&
      payload?.comment?.user?.login === payload.repository.owner.login
    ) {
      // send msg tagging the user who created the issue
      const issue_user = `@${payload.issue.user.login}`;
      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          issue_number: payload.issue.number,
          body: `Hey ${issue_user}! 🤖 We have received a bounty request for this issue. 💵
          You shall receive it soon on your tesior dashboard. 🚀`,
        }
      );
    }
  });

  app.webhooks.on(
    "pull_request_review_comment.created",
    async ({ octokit, payload }) => {
      // check before storing if the comment is a bounty request
      // if comment not made by bot, store in db
      if (payload?.comment?.user?.login !== botUsername) {
        await storePayloadInDb(payload);
      }
    }
  );

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
