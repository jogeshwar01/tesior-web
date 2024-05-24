// Import PrismaClient from the Prisma client package
const { PrismaClient } = require("@prisma/client");

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Add middleware - one out of user_id and admin_id must be specified
prisma.$use(
  async (
    params: {
      model: string;
      action: string;
      args: { data: { user_id: any; admin_id: any; entity: any } };
    },
    next: (arg0: any) => any
  ) => {
    // Add your middleware logic here
    if (params.model === "Payment") {
      if (params.action === "create" || params.action === "update") {
        const { user_id, admin_id, entity } = params.args.data;
        // Validate the payment entry
        if ((user_id && admin_id) || (!user_id && !admin_id)) {
          throw new Error(
            "Invalid payment configuration: Specify exactly one identifier."
          );
        }
        if (
          (entity === "User" && !user_id) ||
          (entity === "Admin" && !admin_id)
        ) {
          throw new Error("Entity type and identifier mismatch.");
        }
      }
    }
    return next(params);
  }
);

export default prisma;
