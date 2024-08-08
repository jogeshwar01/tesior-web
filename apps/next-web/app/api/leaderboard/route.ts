import { NextResponse } from "next/server";
import prisma from "@repo/prisma";
import { getSession } from "@/lib/auth/session";
import { lamportsToSol } from "@/lib/utils/solana";

// Get leaderboard for given user projects
export async function GET() {
  try {
    const session = await getSession();

    // first get all user projects (where user is owner)
    const projects = await prisma.projectUsers.findMany({
      where: {
        user_id: session.user.id,
        role: "owner",
      },
    });

    // get all tasks for the projects
    const tasks = await prisma.task.findMany({
      where: {
        project_id: {
          in: projects.map((project) => project.project_id),
        },
        status: "Paid",
      },
      include: {
        user: true,
      },
    });

    let leaderboard: {
      [key: string]: {
        user_name: string;
        bounty_amount: bigint;
        project_count: number;
      };
    } = {};

    for (const task of tasks) {
      if (!task || !task.user || !task.user.name) {
        continue;
      }

      const user_name = task.user.name;
      const bounty_amount = task.amount || BigInt(0);

      if (!user_name || !bounty_amount) {
        continue;
      }

      if (!(user_name in leaderboard)) {
        leaderboard[user_name] = {
          user_name,
          bounty_amount: BigInt(0),
          project_count: 0,
        };
      }

      leaderboard[user_name]!.bounty_amount += bounty_amount;
      leaderboard[user_name]!.project_count += 1;
    }

    // Sort leaderboard by bounty_amount
    const sortedLeaderboard = Object.fromEntries(
      Object.entries(leaderboard).sort(([, a], [, b]) =>
        b.bounty_amount > a.bounty_amount
          ? 1
          : b.bounty_amount < a.bounty_amount
            ? -1
            : 0
      )
    );

    // convert all bounty_amount to sol
    let leaderboardArr: {
      user_name: string;
      bounty_amount: number;
      project_count: number;
    }[] = [];

    leaderboardArr = Object.values(sortedLeaderboard).map((user) => {
      return {
        user_name: user.user_name,
        bounty_amount: lamportsToSol(user.bounty_amount) ?? 0,
        project_count: user.project_count,
      };
    });

    return NextResponse.json(leaderboardArr, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
