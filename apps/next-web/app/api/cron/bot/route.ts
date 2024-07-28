import { SimplifiedIssueData } from "@/lib/types";
import prisma from "@repo/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isBountyComment, extractAmount } from "@/lib/utils/bot";
import { solToLamports, convertDollarToSolana } from "@/lib/utils/solana";

export async function GET(req: NextRequest) {
  if(req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find 100 unprocessed entries in the GitHubBot table
  const githubBotData = await prisma.githubBot.findMany({
    where: {
      processed: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100,
  });

  const setProcessedInGithubBot = async (id: string) => {
    await prisma.githubBot.update({
      where: {
        id,
      },
      data: {
        processed: true,
      },
    });
  };

  for (const data of githubBotData) {
    let parsedData;
    try {
      parsedData = SimplifiedIssueData.parse(data.payload);
    } catch (e) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    const issue = parsedData.issue;
    const issueComment = issue.comment.body;
    if (!isBountyComment(issueComment)) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    const dollarBountyAmount = extractAmount(issueComment);
    if (!dollarBountyAmount) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    const solBountyAmount = await convertDollarToSolana(dollarBountyAmount);
    const lamportsBountyAmount = solToLamports(solBountyAmount);
    if (issue.repository.owner.login !== issue.comment.user.login) {
      // means the comment user is not the owner of the repo
      await setProcessedInGithubBot(data.id);
      continue;
    }

    // check if user who commented exists in the database
    const user = await prisma.user.findUnique({
      where: {
        name: issue.comment.user.login,
      },
    });

    if (!user) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    if (user.pending_amount < BigInt(lamportsBountyAmount)) {
      // need to handle this case
      console.log("User has insufficient balance");
      // await setProcessedInGithubBot(data.id);
      // need to handle this case
      continue;
    }

    // find if user is owner - check project repoUrl and then if its the owner of that project
    const project = await prisma.project.findFirst({
      where: {
        repoUrl: issue.repository.url,
      },
    });

    if (!project) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    const projectUser = await prisma.projectUsers.findFirst({
      where: {
        project_id: project.id,
        user_id: user.id,
      },
    });

    if (!projectUser) {
      await setProcessedInGithubBot(data.id);
      continue;
    }

    // check if user who created the issue exists in the database
    const issueUser = await prisma.user.findFirst({
      where: {
        name: issue.user.login,
      },
    });

    if (!issueUser) {
      console.log("Issue user not found");
      // await setProcessedInGithubBot(data.id);
      // store this user and his data in some temp db
      continue;
    }

    // check if issue user is already a part of the project, if not add him
    const projectUserExists = await prisma.projectUsers.findFirst({
      where: {
        project_id: project.id,
        user_id: issueUser.id,
      },
    });

    if (!projectUserExists) {
      await prisma.projectUsers.create({
        data: {
          project_id: project.id,
          user_id: issueUser.id,
        },
      });
    }

    // create a task for this user in this project, also approval and transfer, and finally user balances
    await prisma.$transaction(async (tx: any) => {
      const task = await tx.task.create({
        data: {
          project_id: project.id,
          user_id: issueUser.id,
          amount: lamportsBountyAmount,
          proof: issue.url,
          contact: issueUser.email,
          status: "Paid",
        },
      });

      await tx.approval.create({
        data: {
          user_id: user.id,
          task_id: task.id,
          status: "Paid",
        },
      });

      // transfer the amount to the user
      await tx.transfer.create({
        data: {
          sender_id: user.id,
          receiver_id: issueUser.id,
          amount: lamportsBountyAmount,
          task_id: task.id,
        },
      });

      // update balances of sender and receiver
      await prisma.user.update({
        where: { id: user.id },
        data: {
          pending_amount: user.pending_amount - BigInt(lamportsBountyAmount),
        },
      });

      await prisma.user.update({
        where: { id: issueUser.id },
        data: {
          pending_amount:
            issueUser.pending_amount + BigInt(lamportsBountyAmount),
        },
      });

      // Mark the entry as processed
      await prisma.githubBot.update({
        where: {
          id: data.id,
        },
        data: {
          processed: true,
        },
      });
    });
  }

  return NextResponse.json({ processed: true }, { status: 200 });
}
