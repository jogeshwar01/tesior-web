import { PrismaClient as PrismaClientWithoutExtension } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// these 2 will be used in cloudflare worker - using this client and accelerate
export { PrismaClientWithoutExtension };
export { withAccelerate };

export const globalForPrisma = globalThis as unknown as {
  prismaWithoutClientExtensions: PrismaClientWithoutExtension;
  prismaWithClientExtensions: PrismaClientWithExtensions;
};

// Prevents flooding with idle connections
export const prismaWithoutClientExtensions =
  globalForPrisma.prismaWithoutClientExtensions ||
  new PrismaClientWithoutExtension();

// Due to some reason, there are types failing in certain places due to the $extends. Fix it and then enable it
// Specifically we get errors like `Type 'string | Date | null | undefined' is not assignable to type 'Exact<string | Date | null | undefined, string | Date | null | undefined>'`
const prismaWithClientExtensions =
  prismaWithoutClientExtensions.$extends(withAccelerate());

const prisma =
  globalForPrisma.prismaWithClientExtensions || prismaWithClientExtensions;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaWithoutClientExtensions = prismaWithoutClientExtensions;
  globalForPrisma.prismaWithClientExtensions = prisma;
}

type PrismaClientWithExtensions = typeof prismaWithClientExtensions;
export type PrismaClient = PrismaClientWithExtensions;

export default prisma;
